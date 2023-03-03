import { actions, events, kea, listeners, path, reducers, useActions, useValues } from 'kea'
import { loaders } from 'kea-loaders'
import { api, EventStats } from 'lib/api'

import type { eventDetailsLogicType } from './EventDetailsType'
import { EventStatsItem } from './EventStatsItem'

export interface EventDetailsProps {
  target?: string
}

export function EventDetails(props: EventDetailsProps): JSX.Element {
  const { stats } = useValues(eventDetailsLogic)

  const events = props.target && stats.filter(s => s.event === props.target) || stats;
  return (
  <>
    {events.map(s => <EventStatsItem stats={s} />)}
  </>)
}

export const eventDetailsLogic = kea<eventDetailsLogicType>([
  path(['src', 'components', 'EventDetails']),
  actions({
    setStats: (stats: EventStats[]) => ({ stats }),
    loadStats: () => ({}),
  }),
  loaders(({ actions, values }) => ({
    stats: [
      [] as EventStats[], 
      {
      setStats: ({stats}) => (stats)
      }
    ],
  })),
  listeners(({ actions, values }) => ({
    loadStats: async (_, breakpoint) => {
      const response = await api.event.stats()
      actions.setStats(response)
    },
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      actions.loadStats()
    },
  })),
])
