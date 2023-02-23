package wwchen.posthog.hedgehogflix.services

import cats.effect.IO
import org.http4s.HttpRoutes
import org.http4s.dsl.Http4sDsl

abstract class BaseService {
  val dsl: Http4sDsl[IO] = new Http4sDsl[IO] {}
  val routes: HttpRoutes[IO]
}
