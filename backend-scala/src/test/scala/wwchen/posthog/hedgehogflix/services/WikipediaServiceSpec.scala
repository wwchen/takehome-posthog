package wwchen.posthog.hedgehogflix.services

import cats.effect.IO
import io.circe.Json
import io.circe.parser._
import munit.CatsEffectSuite
import org.http4s.circe.jsonDecoder
import org.http4s.client.Client
import org.http4s.dsl.Http4sDsl
import org.http4s.implicits.http4sLiteralsSyntax
import org.http4s.server.Router
import org.http4s.{EntityDecoder, Request, Response, Status, Uri}
import wwchen.posthog.hedgehogflix.clients.WikipediaMockClient

import java.time.{LocalDate, Period}
import scala.jdk.CollectionConverters.IteratorHasAsScala

class WikipediaServiceSpec extends CatsEffectSuite {
  val dsl: Http4sDsl[IO] = new Http4sDsl[IO] {}
  import dsl._

  val wClient = new WikipediaMockClient
  val wService = new WikipediaService(wClient)
  val httpApp = Router("/" -> wService.routes).orNotFound
  val client: Client[IO] = Client.fromHttpApp(httpApp)

  test("datesUntil is inclusive") {
    val startOfMonth = LocalDate.of(2020, 1, 1)
    val endOfMonth = startOfMonth.plus(Period.ofMonths(1))
    val daysInMonth = startOfMonth.datesUntil(endOfMonth).iterator.asScala.toSeq

    assertEquals(daysInMonth.length, 31)
    assertEquals(endOfMonth, LocalDate.of(2020, 2, 1))
    assertEquals(daysInMonth.last, LocalDate.of(2020, 1, 31))
  }

  test("bad paths should 404") {
    val resp = httpApp.run(Request(GET, uri"hello"))
    check[Json](resp, Status.NotFound, None)
  }

  test("bad period in paths should give an error response") {
    val req = httpApp.run(Request(GET, uri"_top/pageViews/badperiod/2020/1/1"))
    val resp = req.unsafeRunSync()
    assertEquals(resp.status, Status.BadRequest)
    val respBody = resp.as[String].unsafeRunSync()
    assert(respBody.contains("Bad period defined: badperiod"))
  }

  test("get weekly most viewed counts (getMostViewed/weekly)") {
    val resp = makeGet(uri"_top/pageViews/weekly/2020/1/1")
    val expectedJson = parse("""
        |[
        |    {
        |        "article": "Carlos_Hathcock",
        |        "startDate": "2020-01-01",
        |        "period": "7 days",
        |        "viewCount": 2800
        |    },
        |    {
        |        "article": "卡洛伍德太平洋鐵路",
        |        "startDate": "2020-01-01",
        |        "period": "7 days",
        |        "viewCount": 2800
        |    },
        |    {
        |        "article": "Special:Search",
        |        "startDate": "2020-01-01",
        |        "period": "7 days",
        |        "viewCount": 2800
        |    },
        |    {
        |        "article": "Main_Page",
        |        "startDate": "2020-01-01",
        |        "period": "7 days",
        |        "viewCount": 2800
        |    },
        |    {
        |        "article": "Cigarette_filter",
        |        "startDate": "2020-01-01",
        |        "period": "7 days",
        |        "viewCount": 2800
        |    }
        |]
        |""".stripMargin).getOrElse(Json.Null)
    resp.assertEquals(expectedJson)
  }

  test("get monthly most viewed counts (getMostViewed/monthly)") {
    val resp = makeGet(uri"_top/pageViews/monthly/2020/1/1")
    val expectedJson = parse("""
        |[
        |    {
        |        "article": "Carlos_Hathcock",
        |        "startDate": "2020-01-01",
        |        "period": "1 month",
        |        "viewCount": 49600
        |    },
        |    {
        |        "article": "卡洛伍德太平洋鐵路",
        |        "startDate": "2020-01-01",
        |        "period": "1 month",
        |        "viewCount": 49600
        |    },
        |    {
        |        "article": "Special:Search",
        |        "startDate": "2020-01-01",
        |        "period": "1 month",
        |        "viewCount": 49600
        |    },
        |    {
        |        "article": "Main_Page",
        |        "startDate": "2020-01-01",
        |        "period": "1 month",
        |        "viewCount": 49600
        |    },
        |    {
        |        "article": "Cigarette_filter",
        |        "startDate": "2020-01-01",
        |        "period": "1 month",
        |        "viewCount": 49600
        |    }
        |]
        |""".stripMargin).getOrElse(Json.Null)
    resp.assertEquals(expectedJson)
  }

  test("get weekly page view counts for an article (getArticleStats)") {
    val resp = makeGet(uri"Main_Page/pageViews/weekly/2020/1/1")
    val expectedJson = parse("""
        |{
        |    "article": "Main_Page",
        |    "startDate": "2020-01-01",
        |    "period": "7 days",
        |    "viewCount": 2800
        |}
        |""".stripMargin).getOrElse(Json.Null)
    resp.assertEquals(expectedJson)
  }

  test("get monthly page view counts for an article (getArticleStats)") {
    val resp = makeGet(uri"Main_Page/pageViews/monthly/2020/1/1")
    val expectedJson = parse("""
        |{
        |    "article": "Main_Page",
        |    "startDate": "2020-01-01",
        |    "period": "1 month",
        |    "viewCount": 49600
        |}
        |""".stripMargin).getOrElse(Json.Null)
    resp.assertEquals(expectedJson)
  }

  test("get top day page view count for an article (getArticleTopCount)") {
    val resp = makeGet(uri"Main_Page/pageViews/topDailyViewsInMonth/2020/1")
    val expectedJson = parse("""
        |{
        |    "article": "Main_Page",
        |    "startDate": "2020-01-31",
        |    "period": "1 day",
        |    "viewCount": 3100
        |}
        |""".stripMargin).getOrElse(Json.Null)
    resp.assertEquals(expectedJson)
  }

  // Return true if match succeeds; otherwise false
  private def check[A](actual: IO[Response[IO]], expectedStatus: Status, expectedBody: Option[A])(
      implicit ev: EntityDecoder[IO, A]
  ): Boolean = {
    val actualResp = actual.unsafeRunSync()
    val statusCheck = actualResp.status == expectedStatus
    val bodyCheck = expectedBody.fold[Boolean](
      // Verify Response's body is empty.
      actualResp.body.compile.toVector.unsafeRunSync().isEmpty
    )(
      expected => actualResp.as[A].unsafeRunSync() == expected
    )
    statusCheck && bodyCheck
  }

  private def makeGet(uri: Uri): IO[Json] = {
    val request: Request[IO] = Request(GET, uri)
    client.expect[Json](request)
  }
}
