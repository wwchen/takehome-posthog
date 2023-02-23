package wwchen.posthog.hedgehogflix.db

import cats.effect.IO
import io.circe.Decoder.Result
import io.circe.{Decoder, HCursor}
import io.circe.generic.extras._
import io.circe.parser.decode
import wwchen.posthog.hedgehogflix.db.FlixEventDb.{Event, User}

import java.time.LocalDateTime
import scala.io.Source

trait FlixEventDb {
  def getEvents(): IO[Seq[Event]]
  def getUsers(): IO[Seq[User]]
}

object FlixEventDb {
//  implicit val customConfig: Configuration = Configuration
//    .default
//    .withSnakeCaseMemberNames

  case class Event(event: String, distinct_id: String, timestamp: LocalDateTime, properties: Map[String, String])
  case class User(userId: String, distinctIds: Seq[String], properties: Map[String, String])
}

class FlixEventFileDb extends FlixEventDb {
  import io.circe.generic.auto._

//  implicit val propertyKeyDecoder: KeyDecoder[PropertyKey] = new KeyDecoder[PropertyKey] {
//    override def apply(key: String): Option[PropertyKey] = key match {
//      case "browser" => Some(Browser)
//      case "country" => Some(Country)
//      case "plan" => Some(Plan)
//      case key => Some(Unknown(key))
//    }
//  }
//  implicit val propertyDecoder: Decoder[PropertyKey] = Decoder.decodeString.emapTry({
//    case "browser" => Success(Browser)
//    case "country" => Success(Country)
//    case "plan" => Success(Plan)
//    case key => Success(Unknown(key))
//  })

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
  override def getEvents(): IO[Seq[Event]] = IO.pure(events)
  override def getUsers(): IO[Seq[User]] = IO.pure(users)
}
