package wwchen.posthog.hedgehogflix.services

import cats.effect.IO
import io.circe.generic.auto.exportEncoder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.circeEntityEncoder
import wwchen.posthog.hedgehogflix.clients.JokeClient

class JokeService(jokeClient: JokeClient) extends BaseService {
  import dsl._

  val routes: HttpRoutes[IO] = HttpRoutes.of[IO] {
    case GET -> Root => Ok(jokeClient.getJoke)
  }
}
