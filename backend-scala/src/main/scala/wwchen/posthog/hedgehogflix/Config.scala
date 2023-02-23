package wwchen.posthog.hedgehogflix

import org.http4s.implicits.http4sLiteralsSyntax

import java.time.Period

object Config {
  object HttpClient {
    val MaxRedirects = 10
    val LogHeaders = false
    val LogBody = false
  }
  object HttpServer {
    val LogHeaders = false
    val LogBody = false
  }

  object Services {
    object Joke {
      val RootPath = "/jokes"
      val RepoUri = uri"https://icanhazdadjoke.com/"
    }
  }
}
