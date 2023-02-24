package wwchen.posthog.hedgehogflix.services

import cats.effect.IO
import munit.CatsEffectSuite
import org.http4s.dsl.Http4sDsl
import wwchen.posthog.hedgehogflix.db.FlixEventDb

import java.time.{LocalDate, LocalDateTime, Period}
import scala.jdk.CollectionConverters.IteratorHasAsScala

class FlixAnalyticsSpec extends CatsEffectSuite {
  val dsl: Http4sDsl[IO] = new Http4sDsl[IO] {}

  test("datesUntil is inclusive") {
    val startOfMonth = LocalDate.of(2020, 1, 1)
    val endOfMonth = startOfMonth.plus(Period.ofMonths(1))
    val daysInMonth = startOfMonth.datesUntil(endOfMonth).iterator.asScala.toSeq

    assertEquals(daysInMonth.length, 31)
    assertEquals(endOfMonth, LocalDate.of(2020, 2, 1))
    assertEquals(daysInMonth.last, LocalDate.of(2020, 1, 31))
  }


  test("event chaining") {
    val db = new FlixEventDb {
      def getEvents(): Seq[FlixEventDb.Event] = Seq(
        FlixEventDb.Event("a", "user-a", LocalDateTime.of(2022, 1, 1, 0, 0), Map.empty),
        FlixEventDb.Event("b", "user-a", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("d", "user-a", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("c", "user-a", LocalDateTime.of(2022, 1, 4, 0, 0), Map.empty),
        FlixEventDb.Event("d", "user-a", LocalDateTime.of(2022, 1, 5, 0, 0), Map.empty),
      )

      def getUsers(): Seq[FlixEventDb.User] = Seq(
        FlixEventDb.User("user-a", Seq("user-a"), Map.empty)
      )
    }
    val app = new FlixAnalytics(db)
    assertEquals(app.eventChaining(Seq("a")).map(_.event), Seq("b", "c", "d"))
    assertEquals(app.eventChaining(Seq("a", "b")).map(_.event), Seq("c", "d"))
    assertEquals(app.eventChaining(Seq("a", "c")).map(_.event), Seq("d"))
  }

  test("event chaining with multiple users") {
    val db = new FlixEventDb {
      def getEvents(): Seq[FlixEventDb.Event] = Seq(
        FlixEventDb.Event("a", "user-a", LocalDateTime.of(2022, 1, 1, 0, 0), Map.empty),
        FlixEventDb.Event("b", "user-b", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("b", "user-a", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("b", "234", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("c", "123", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("c", "user-b", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("c", "user-b", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("d", "234", LocalDateTime.of(2022, 1, 4, 0, 0), Map.empty),
        FlixEventDb.Event("d", "user-a", LocalDateTime.of(2022, 1, 4, 0, 0), Map.empty),
      )

      def getUsers(): Seq[FlixEventDb.User] = Seq(
        FlixEventDb.User("user-a", Seq("user-a", "123"), Map.empty),
        FlixEventDb.User("user-b", Seq("user-b", "234"), Map.empty),
      )
    }
    val app = new FlixAnalytics(db)
    assertEquals(app.eventChaining(Seq("a")).map(_.event), Seq("b", "c", "d"))
    assertEquals(app.eventChaining(Seq("a", "b")).map(_.event), Seq("c", "d"))
    assertEquals(app.eventChaining(Seq("a", "c")).map(_.event), Seq("d"))
  }

  test("user distinction") {
    val db = new FlixEventDb {
      def getEvents(): Seq[FlixEventDb.Event] = Seq(
        FlixEventDb.Event("a", "user-a", LocalDateTime.of(2022, 1, 1, 0, 0), Map.empty),
        FlixEventDb.Event("b", "user-b", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("c", "234", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),

      )

      def getUsers(): Seq[FlixEventDb.User] = Seq(
        FlixEventDb.User("user-a", Seq("user-a", "123"), Map.empty),
        FlixEventDb.User("user-b", Seq("user-b"), Map.empty),
        FlixEventDb.User("user-c", Seq("user-c", "234"), Map.empty),
      )
    }
    val app = new FlixAnalytics(db)
    val users = app.users()
    assertEquals(users.length, 3)
    assertEquals(users.count(_.isAnon), 1)
    assertEquals(users.count(!_.isAnon), 2)
  }

  test("countValues") {
    val db = new FlixEventDb {
      def getEvents(): Seq[FlixEventDb.Event] = Seq(
        FlixEventDb.Event("a", "user-a", LocalDateTime.of(2022, 1, 1, 0, 0), Map.empty),
        FlixEventDb.Event("b", "user-b", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("b", "user-a", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("b", "234", LocalDateTime.of(2022, 1, 2, 0, 0), Map.empty),
        FlixEventDb.Event("c", "123", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("c", "user-b", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("c", "user-b", LocalDateTime.of(2022, 1, 3, 0, 0), Map.empty),
        FlixEventDb.Event("d", "234", LocalDateTime.of(2022, 1, 4, 0, 0), Map.empty),
        FlixEventDb.Event("d", "user-a", LocalDateTime.of(2022, 1, 4, 0, 0), Map.empty),
      )

      def getUsers(): Seq[FlixEventDb.User] = Seq(
        FlixEventDb.User("user-a", Seq("user-a", "123"), Map.empty),
        FlixEventDb.User("user-b", Seq("user-b", "234"), Map.empty),
      )
    }
    val app = new FlixAnalytics(db)
    assertEquals(app.eventChainingCount(Seq("a")), Map("b" -> 1, "c" -> 1, "d" -> 1))
    assertEquals(app.eventChainingCount(Seq("a", "b")), Map("c" -> 1, "d" -> 1))
    assertEquals(app.eventChainingCount(Seq("a", "c")), Map("d" -> 1))
  }
}
