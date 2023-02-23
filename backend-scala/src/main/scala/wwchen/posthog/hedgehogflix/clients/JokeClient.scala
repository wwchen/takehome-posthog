package wwchen.posthog.hedgehogflix.clients

import cats.effect.IO
import cats.implicits.catsSyntaxMonadError
import io.circe.generic.auto._
import org.http4s.Method.GET
import org.http4s.circe.CirceEntityCodec.circeEntityDecoder
import org.http4s.client.Client
import org.http4s.client.dsl.Http4sClientDsl
import wwchen.posthog.hedgehogflix.Config
import wwchen.posthog.hedgehogflix.clients.JokeClient.{Joke, JokeError}


class JokeClient(httpClient: Client[IO]) {
  val dsl = new Http4sClientDsl[IO] {}

  import dsl._

  def getJoke: IO[Joke] = {
    for {
      joke <- httpClient
        .expect[Joke](GET(Config.Services.Joke.RepoUri))
        .adaptError { case t => JokeError(t) } // Prevent Client Json Decoding Failure Leaking
    } yield joke
  }
}
object JokeClient {
  case class Joke(joke: String) extends AnyVal
  case class JokeError(e: Throwable) extends RuntimeException
}
