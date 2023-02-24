package wwchen.posthog.hedgehogflix.db

import io.circe.Decoder.Result
import io.circe.parser.decode
import io.circe.{Decoder, HCursor}
import wwchen.posthog.hedgehogflix.db.FlixEventDb.{Event, User}

import java.time.LocalDateTime
import scala.io.Source

trait FlixEventDb {
  def getEvents(): Seq[Event]
  def getUsers(): Seq[User]
}

object FlixEventDb {
  case class Event(event: String, distinct_id: String, timestamp: LocalDateTime, properties: Map[String, String])
  case class User(userId: String, distinctIds: Seq[String], properties: Map[String, String])
}

class FlixEventFileDb extends FlixEventDb {
  import io.circe.generic.auto._

  implicit val decodeUser: Decoder[User] = new Decoder[User] {
    override def apply(c: HCursor): Result[User] =
      for {
        userId <- c.downField("user_id").as[String]
        properties <- c.downField("properties").as[Option[Map[String, String]]]
      } yield {
        val distinctIds = c.downField("distinct_ids").values.getOrElse(Iterable.empty)
        val distinctIdStrings = distinctIds.flatMap { value =>
          value.asNumber.map(_.toString).orElse(value.asString)
        }.toSeq
        User(userId, distinctIdStrings, properties.getOrElse(Map.empty))
      }
  }
  def readFile(path: String): String = Source.fromResource(path).getLines.mkString("\n")

  val events = decode[Seq[Event]](readFile("data/events.json")).getOrElse(Seq.empty)
  val users = decode[Seq[User]](readFile("data/users.json")).getOrElse(Seq.empty)
  decode[Seq[User]](readFile("data/users.json")).left.foreach(println)
  override def getEvents(): Seq[Event] = events
  override def getUsers(): Seq[User] = users
}
