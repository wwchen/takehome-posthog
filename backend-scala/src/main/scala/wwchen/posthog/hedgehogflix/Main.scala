package wwchen.posthog.hedgehogflix

import cats.effect._
import cats.effect.unsafe.implicits.global
import io.circe.generic.auto._
import com.comcast.ip4s.{IpLiteralSyntax, Port}
import com.typesafe.scalalogging.Logger
import org.http4s.server.middleware.{CORS, Logger => ServerLogger}
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Router
import wwchen.posthog.hedgehogflix.db.FlixEventFileDb
import wwchen.posthog.hedgehogflix.services.{BaseService, FlixAnalytics}

object Main extends IOApp {
  def run(args: List[String]): IO[ExitCode] = {
    val defaultOption = "server"
    args.headOption.getOrElse(defaultOption) match {
      case "server" => runServer()
      case "stream" => runStream()
    }
  }

  def runServer() = {
    val db = new FlixEventFileDb()
    val api = new FlixAnalytics(db)

    val service = new BaseService(db, api)

    val httpApp = CORS(
      ServerLogger.httpApp(
        logHeaders = Config.HttpServer.LogHeaders,
        logBody = Config.HttpServer.LogBody
      )(Router("/" -> service.routes).orNotFound))

    val defaultPort = "8080"
    val port = Port.fromString(sys.env.getOrElse("PORT", defaultPort)).get

    EmberServerBuilder
      .default[IO]
      .withHost(ipv4"0.0.0.0")
      .withPort(port)
      .withHttpApp(httpApp)
      .build
      .use(_ => IO.never)
      .as(ExitCode.Success)
  }

  def runStream() = {
    val db = new FlixEventFileDb()
    val api = new FlixAnalytics(db)
    val logger = Logger("run")

    val res = api.userEvents("526d827c-5dda-4d56-865d-9ea081031094")
    val res2 = api.eventChaining(Seq("user visited home page"))
    logger.info(res.mkString(", "))
    logger.info(res2.mkString(", "))
    IO(ExitCode.Success)
  }
}


