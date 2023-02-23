package wwchen.posthog.hedgehogflix.services

import cats.effect.IO
import cats.implicits._
import com.typesafe.scalalogging.Logger
import wwchen.posthog.hedgehogflix.db.FlixEventDb
import wwchen.posthog.hedgehogflix.services.FlixAnalytics.{AuthedUser, Event}

import java.time.LocalDateTime

trait FlixAnalyticsApi {
  def getUserEvents(userId: String): IO[Seq[Event]]

  def getAuthedUsers(): IO[Seq[AuthedUser]]
}

object FlixAnalytics {
  case class Event(event: String, timestamp: LocalDateTime)
  case class AuthedUser(id: String, email: String, lastSeen: LocalDateTime)
}

class FlixAnalytics(db: FlixEventDb) extends FlixAnalyticsApi {
  val logger = Logger("analytics")
  override def getUserEvents(userId: String): IO[Seq[Event]] = {
    for {
      users <- db.getUsers()
      events <- db.getEvents()
    } yield {
      val user = users.filter(_.userId == userId)
      val distinctIds = user.flatMap(_.distinctIds)
      val e = events.filter(e => distinctIds.contains(e.distinct_id))
      e.map(fromDb).sortBy(_.timestamp)
    }
  }
  override def getAuthedUsers(): IO[Seq[AuthedUser]] = {
    for {
      users <- db.getUsers()
      authedUsers <- users.filter(_.distinctIds.exists(_.forall(Character.isDigit))).map { user =>
        for {
          events <- getUserEvents(user.userId)
        } yield AuthedUser(user.distinctIds.last, user.properties.getOrElse("email", ""), events.last.timestamp)
      }.sequence
    } yield authedUsers.sortBy(_.lastSeen)
  }

  private def fromDb(e: FlixEventDb.Event): Event = Event(e.event, e.timestamp)
}
