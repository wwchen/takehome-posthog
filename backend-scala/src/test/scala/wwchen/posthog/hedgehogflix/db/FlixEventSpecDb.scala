package wwchen.posthog.hedgehogflix.db

import org.joda.time.DateTime

import java.time.LocalDateTime

class FlixEventSpecDb extends FlixEventDb {
  override def getEvents(): Seq[FlixEventDb.Event] = Seq(
    FlixEventDb.Event("a", "a", LocalDateTime.of(2022, 1, 1, 0, 0), Map.empty),
  )

  override def getUsers(): Seq[FlixEventDb.User] = Seq(
    FlixEventDb.User("user-a", Seq.empty, Map.empty)
  )
}
