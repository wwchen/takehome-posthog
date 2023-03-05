import { Card, Collapse } from 'antd'
import { useValues } from 'kea'
import { eventDetailsLogic } from 'scenes/eventDetailsLogic'

import { EventStatsItem } from './EventStatsItem'

export interface EventDetailsProps {
  target?: string
}

export function EventDetails(props: EventDetailsProps): JSX.Element {
  const { stats, selectedEvent } = useValues(eventDetailsLogic)

  const activeEventName = props.target || selectedEvent
  // const targetedEvent = stats.filter((s) => s.event === activeEventName).at(0)
  // const events = targetedEvent ? [targetedEvent] : stats
  const events = stats
  return (
    <>
      <Card title="Event stats summary">
        <Collapse key={activeEventName} accordion defaultActiveKey={activeEventName}>
          {events.map((s) => (
            <Collapse.Panel header={s.event} key={s.event}>
              <EventStatsItem stats={s} />
            </Collapse.Panel>
          ))}
        </Collapse>
      </Card>
    </>
  )
}
