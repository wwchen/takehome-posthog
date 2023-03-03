package wwchen.posthog.hedgehogflix.services

import cats.implicits._
import com.typesafe.scalalogging.Logger
import wwchen.posthog.hedgehogflix.db.FlixEventDb
import wwchen.posthog.hedgehogflix.db.FlixEventDb.Event
import wwchen.posthog.hedgehogflix.services.FlixAnalytics.{AggEvent, Edge, EventStats, ItemWithCount, NextEventItem, User}

import java.time.LocalDateTime
import scala.util.Try

trait FlixAnalyticsApi {
  // events by user
  def userEvents(userId: String): Seq[Event]
  // get all users
  def users(): Seq[User]

  def userEventProperties(userId: String): Map[String, String]

  def eventPropertyCount(): Map[String, Map[String, Int]]

  def eventPropertyKeys: Seq[String]

  // how many events follow the prefix event chain
  def eventChaining(chain: Seq[String]): Iterable[AggEvent]
  def eventChainingCount(chain: Seq[String]): Map[String, Int]

  def nextEvents(chain: Seq[String]): Iterable[NextEventItem]
  def eventStats(): Seq[EventStats]
  def eventEdges(): Iterable[Edge]
}

object FlixAnalytics {
  case class AggEvent(event: String, lastFired: LocalDateTime, properties: Map[String, String], userIds: Set[String])
  case class NextEventItem(event: Option[String], count: Int)
  case class User(id: String, email: Option[String], lastSeenAt: LocalDateTime, isAnon: Boolean)

  case class Edge(from: String, to: String, count: Int)

  case class ItemWithStats[A](item: A, min: Int, max: Int, median: Float, average: Float)
  case class ItemWithCount[A](item: A, count: Int)
  case class EventStats(event: String,
                        totalFired: Int,
                        percentage: Float,
                        mostPrecededBy: ItemWithCount[String],
                        mostFollowedBy: ItemWithCount[String],
                        lastFiredAt: LocalDateTime,
                        properties: Map[String, Seq[ItemWithCount[String]]])

}

class FlixAnalytics(db: FlixEventDb) extends FlixAnalyticsApi {
  val logger = Logger("analytics")

  val eventsByUser: Map[String, Seq[Event]] = {
    val users = db.getUsers()
    users.map(u => u.userId -> _getUserEvents(u.userId)).toMap
  }

  val eventPropertiesByUser: Map[String, Map[String, String]] = {
    eventsByUser.map { kv =>
      val userId = kv._1
      val events = kv._2.map(_.properties)
      val userEventProperties = (userId, events.flatMap(_.toList).groupBy(_._1).map(_._2.last))
      userEventProperties
    }
  }

  def userEvents(userId: String): Seq[Event] = {
    eventsByUser.getOrElse(userId, Seq.empty)
  }

  private def _getUserEvents(userId: String): Seq[Event] = {
    val users = db.getUsers()
    val events = db.getEvents()
    val user = users.filter(_.userId == userId)
    val distinctIds = user.flatMap(_.distinctIds)
    val e = events.filter(e => distinctIds.contains(e.distinct_id))
    e.sortBy(_.timestamp)
  }
  def users(): Seq[User] = {
    db.getUsers().map { user =>
      val hasNumericalId = user.distinctIds.exists(_.forall(Character.isDigit))
      User(user.userId, user.properties.get("email"), userEvents(user.userId).last.timestamp, !hasNumericalId)
    }.sortBy(_.lastSeenAt)
  }

  private def userByDistinctId(id: String): Option[User] =
    db.getUsers().find { user =>
      user.distinctIds.contains(id)
    }.map { user =>
      val hasNumericalId = user.distinctIds.exists(_.forall(Character.isDigit))
      User(user.userId, user.properties.get("email"), userEvents(user.userId).last.timestamp, !hasNumericalId)
    }

  def userEventProperties(userId: String): Map[String, String] =
    eventPropertiesByUser.getOrElse(userId, Map.empty)

  def eventPropertyCount(): Map[String, Map[String, Int]] =
    eventPropertiesByUser.values.flatMap(_.toList).groupBy(_._1).map { kv =>
      val propKey = kv._1
      val propValues = kv._2.map(_._2)
      val propValuesCounts = propValues.groupMapReduce(identity)(_ => 1)(_ + _)
      Map(propKey -> propValuesCounts)
    }.reduceLeft(_ ++ _)

  def eventCount(): Map[String, Int] = {
    val events = db.getEvents()
    events.groupBy(_.event).map(t => (t._1, t._2.length))
  }

  def eventKeys: Seq[String] = {
    val events = db.getEvents()
    events.map(_.event).distinct.sorted
  }
  def eventPropertyKeys: Seq[String] = {
    val events = db.getEvents()
    events.flatMap(_.properties.keys).distinct.sorted
  }
  def eventChaining(chain: Seq[String]) = {
    eventChainingIterable(chain).groupBy(_.event).map {kv =>
      AggEvent(
        event = kv._1,
        lastFired = kv._2.map(_.timestamp).max,
        properties = kv._2.map(_.properties).reduceLeft(_ ++ _),
        userIds = kv._2.map(_.distinct_id).toSet.flatMap(userByDistinctId).map(_.id)
      )
    }.toSeq.sortBy(-_.userIds.size)
  }

  def eventChainingCount(chain: Seq[String]): Map[String, Int] = {
    countValues(eventChainingIterable(chain).map(_.event))
  }

  def nextEvents(breadcrumb: Seq[String]): Iterable[NextEventItem] = {
    val eventChains = eventsByUser.values.map(_.map(_.event))
    val nextEvents = if (breadcrumb.isEmpty) {
      eventChains
    } else {
      eventChains
        .filter(_.startsWith(breadcrumb))
        .map(_.splitAt(breadcrumb.length)._2)
    }
    nextEvents
      .map(_.headOption)
      .groupMapReduce(identity)(toNextEventItem)((a, b) => a.copy(count = a.count + b.count))
      .values
      .toSeq
      .sortBy(-_.count)
  }

  def eventStats(): Seq[EventStats] = {
    val totalEvents = db.getEvents()
    val events = totalEvents.groupBy(_.event).values
    val connectivity = eventEdges()

    events.toSeq.map { event =>
      val name = event.head.event
      val connectFrom = connectivity.filter(e => e.to == name).maxBy(_.count)
      val connectTo = connectivity.filter(e => e.from == name).maxBy(_.count)
//      val properties = event.flatMap(_.properties.toSeq).groupMap(_._1)(_._2).view.mapValues(_.distinct).toMap
      val properties = event.flatMap(_.properties.toSeq).groupBy(_._1).values.map { propertyKv =>
        val propertyKey = propertyKv.head._1
        val valuesWithCount = countValues(propertyKv.map(_._2))
        propertyKey -> valuesWithCount.map(v => ItemWithCount.apply(v._1, v._2)).toSeq
      }.toMap
      EventStats(
        event = name,
        totalFired = event.size,
        percentage = event.size.toFloat / totalEvents.size,
        mostPrecededBy = ItemWithCount(connectFrom.from, connectFrom.count),
        mostFollowedBy = ItemWithCount(connectTo.to, connectTo.count),
        lastFiredAt = event.maxBy(_.timestamp).timestamp,
        properties = properties
      )
    }.sortBy(-_.totalFired)
  }

  def eventEdges(): Seq[Edge] = {
    val eventChains = eventsByUser.values.map(_.map(_.event)).map(e => Seq("*") ++ e ++ Seq("* user drop off"))
    val tuples = eventChains.flatMap(_.sliding(2))
    countValues(tuples).map { ki =>
      Edge(ki._1.head, ki._1.last, ki._2)
    }.toSeq.sortBy(-_.count)
  }

  private def eventChainingIterable(chain: Seq[String]) = {
    eventsByUser.values.flatMap { e =>
      val events = e.map(_.event)
      Try {
        val indices = chain.filterNot(_ === "x").map { e =>
          events.zipWithIndex.filter(ki => ki._1 == e).map(_._2) // find all indices where events is "e"
        }.scanLeft(-1)((prev, indices) => indices.filter(prev < _).min) // take the min index past the prev min i
        e.splitAt(indices.last + 1)._2
      }.toOption.getOrElse(Seq.empty).distinct
    }
  }

  private def toNextEventItem(event: Option[String]) = NextEventItem(event, 1)

  private def countValues[A](map: Iterable[A]): Map[A, Int] = map.groupMapReduce(identity)(_ => 1)(_ + _)
}
