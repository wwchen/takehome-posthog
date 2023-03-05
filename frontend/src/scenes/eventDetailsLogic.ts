import { actions, connect, reducers, events, kea, listeners, path } from 'kea'
import { loaders } from 'kea-loaders'
import { api, EventStats } from 'lib/api'

import type { eventDetailsLogicType } from './eventDetailsLogicType'
import { Step, eventFunnelLogic } from './eventFunnelLogic'

export const eventDetailsLogic = kea<eventDetailsLogicType>([
  path(['src', 'components', 'EventDetails']),
  connect({
    actions: [eventFunnelLogic, ['setResults']],
  }),
  actions({
    setStats: (stats: EventStats[]) => ({ stats }),
    setSelectedEvent: (event: string) => ({ event }),
    loadStats: () => ({}),
  }),
  loaders(({ actions, values }) => ({
    stats: [
      [] as EventStats[],
      {
        setStats: ({ stats }) => stats,
      },
    ],
  })),
  reducers(({ actions, values }) => ({
    selectedEvent: [
      '',
      {
        // [eventFunnelLogic.actionTypes.setResults]: (_, {step}) => step.title
        setSelectedEvent: (_, { event }) => event || '',
      },
    ],
  })),
  listeners(({ actions, values }) => ({
    loadStats: async (_, breakpoint) => {
      const response = await api.event.stats()
      actions.setStats(response)
    },
    [eventFunnelLogic.actionTypes.setResults]: ({ step }) => {
      actions.setSelectedEvent(step.title)
    },
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      actions.loadStats()
    },
  })),
])
