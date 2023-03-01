import React from 'react'

export default function UserEvent({ events }) {
  if (!events) return <></>
  return (
    <div>
      {events.map((event, i) => (
        <div key={i}>
          {event.event} ({event.timestamp})
        </div>
      ))}
    </div>
  )
}
