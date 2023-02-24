package wwchen.posthog.hedgehogflix.services

import cats.implicits._
import com.typesafe.scalalogging.Logger
import wwchen.posthog.hedgehogflix.db.FlixEventDb
import wwchen.posthog.hedgehogflix.services.FlixAnalytics.{Event, User}

import java.time.LocalDateTime
import scala.util.Try

trait FlixAnalyticsApi {
  // events by user
  def userEvents(userId: String): Seq[Event]
  // get all users
  def users(): Seq[User]

  def userEventProperties(userId: String): Map[String, String]

  def eventPropertyCount(): Map[String, Map[String, Int]]

  // count of distinct event
  def eventCount(): Map[String, Int]

  def eventKeys: Seq[String]
  def eventPropertyKeys: Seq[String]

  // how many events follow the prefix event chain
  def eventChaining(chain: Seq[String]): Map[String, Int]
}

object FlixAnalytics {
  case class Event(event: String, timestamp: LocalDateTime, properties: Map[String, String])
  case class User(id: String, email: Option[String], lastSeen: LocalDateTime, isAnon: Boolean)
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
    e.map(fromDb).sortBy(_.timestamp)
  }
  def users(): Seq[User] = {
    val users = db.getUsers()
    users.map { user =>
      val hasNumericalId = user.distinctIds.exists(_.forall(Character.isDigit))
      User(user.userId, user.properties.get("email"), userEvents(user.userId).last.timestamp, !hasNumericalId)
    }.sortBy(_.lastSeen)
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
  def eventChaining(chain: Seq[String]): Map[String, Int] = {
    eventsByUser.values.flatMap { e =>
      val events = e.map(_.event)
      Try {
        val indices = chain.filterNot(_ === "x").map { e =>
          events.zipWithIndex.filter(ki => ki._1 == e).map(_._2)       // find all indices where events is "e"
        }.scanLeft(-1)((prev, indices) => indices.filter(prev < _).min) // take the min index past the prev min i
        events.splitAt(indices.last+1)._2
      }.toOption.getOrElse(Seq.empty[String]).distinct
    }.groupMapReduce(identity)(_ => 1)(_ + _)
  }

  private def fromDb(e: FlixEventDb.Event): Event = Event(e.event, e.timestamp, e.properties)
}
