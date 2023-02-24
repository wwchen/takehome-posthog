package wwchen.posthog.hedgehogflix.services

import cats.effect.IO
import io.circe.generic.auto._
import org.http4s.circe.CirceEntityCodec.{circeEntityDecoder, circeEntityEncoder}
import org.http4s.client.UnexpectedStatus
import org.http4s.dsl.Http4sDsl
import org.http4s.{EntityEncoder, HttpRoutes, Response}
import wwchen.posthog.hedgehogflix.db.FlixEventDb
import io.circe.parser.decode

import java.time.DateTimeException

class BaseService(db: FlixEventDb, api: FlixAnalyticsApi) {
  val dsl: Http4sDsl[IO] = new Http4sDsl[IO] {}
  import dsl._

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case GET -> Root / "user" / userId / "events" => handleRequest(api.userEvents(userId))
    case GET -> Root / "user" / userId / "eventProperties" => handleRequest(api.userEventProperties(userId))
    case GET -> Root / "users" => handleRequest(api.users())
//    case GET -> Root / "events" => handleRequest(db.getEvents())
//    case GET -> Root / "events" / "count" => handleRequest(api.eventCount())
    case GET -> Root / "event-properties" => handleRequest(api.eventPropertyCount())
    case r @ POST -> Root / "event-funnel" => handleRequestIO {
      for {
        req <- r.as[EventFunnelRequest]
      } yield api.eventChaining(req.path)
    }
  }

  case class EventFunnelRequest(path: Seq[String])

  private def handleRequest[B](f: => B)(implicit entityEncoder: EntityEncoder[IO, B]): IO[Response[IO]] = {
    IO(f).flatMap(Ok(_)).handleErrorWith {
      case e: DateTimeException => BadRequest(e.toString)
      case e: UnexpectedStatus =>
        if (e.status == NotFound) {
          BadRequest(s"Cannot make underlying api request to ${e.requestUri} Check if article name is correct.")
        }
        else BadRequest(e.toString)
      case e => BadRequest(e.toString)
    }
  }

  private def handleRequestIO[B](f: => IO[B])(implicit entityEncoder: EntityEncoder[IO, B]): IO[Response[IO]] = {
    IO(f).flatMap(Ok(_)).handleErrorWith {
      case e: DateTimeException => BadRequest(e.toString)
      case e: UnexpectedStatus =>
        if (e.status == NotFound) {
          BadRequest(s"Cannot make underlying api request to ${e.requestUri} Check if article name is correct.")
        }
        else BadRequest(e.toString)
      case e => BadRequest(e.toString)
    }
  }
}
