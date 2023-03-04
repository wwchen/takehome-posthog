import { Card, Timeline } from 'antd'
import { api, User, Event } from 'lib/api'

export interface EventTimelineProps {
  events: Event[]
}

export function EventTimeline(props: EventTimelineProps): JSX.Element {
  return (
    <>
      <Card>
        <Timeline mode="left">
          {props.events
            .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf())
            .map((event) => {
              return (
                <>
                  <Timeline.Item label={event.timestamp.toLocaleString()}>{event.event}</Timeline.Item>
                </>
              )
            })}
        </Timeline>
      </Card>
    </>
  )
}
