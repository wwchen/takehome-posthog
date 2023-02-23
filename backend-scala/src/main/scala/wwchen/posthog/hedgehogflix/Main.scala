package wwchen.posthog.hedgehogflix

import cats.effect._
import cats.syntax.all._
import com.comcast.ip4s.IpLiteralSyntax
import org.http4s.client.middleware.{FollowRedirect, Logger => ClientLogger}
import org.http4s.ember.client.EmberClientBuilder
import org.http4s.ember.server.EmberServerBuilder
import org.http4s.server.Router
import org.http4s.server.middleware.{Logger => ServerLogger}
import wwchen.posthog.hedgehogflix.clients.JokeClient
import wwchen.posthog.hedgehogflix.services.JokeService

object Main extends IOApp {
  def run(args: List[String]): IO[ExitCode] = {
    for {
      // http client to be used throughout the app
      baseHttpClient <- EmberClientBuilder.default[IO].build
      httpClient = ClientLogger(
        logHeaders = Config.HttpClient.LogHeaders,
        logBody = Config.HttpClient.LogBody
      )(FollowRedirect[IO](
          maxRedirects = Config.HttpClient.MaxRedirects
        )(baseHttpClient)
      )

      // lightweight "dependency injection"
      jokeClient = new JokeClient(httpClient)

      // "app" instantiation
      jokeService = new JokeService(jokeClient)

      // root route router
      routes = Router(
        Config.Services.Joke.RootPath -> jokeService.routes,
      ).orNotFound

      // middleware
      loggedApp = ServerLogger.httpApp(
        logHeaders = Config.HttpServer.LogHeaders,
        logBody = Config.HttpServer.LogBody
      )(routes)

      exitCode <- EmberServerBuilder
        .default[IO]
        .withHost(ipv4"0.0.0.0")
        .withPort(port"8080")
        .withHttpApp(loggedApp)
        .build
        .as(ExitCode.Success)
    } yield exitCode
  }.use(_ => IO.never)
}
