import { actions, connect, kea, path, events, reducers, selectors, listeners } from 'kea'

import { FilterType } from 'components/UserTable'
import { userLogic } from './userLogic'

import { eventFunnelLogic } from './eventFunnelLogic'
import type { userTableLogicType } from './userTableLogicType'
import { api } from 'lib/api'

export const userTableLogic = kea<userTableLogicType>([
  path(['src', 'scenes', 'userTableLogic']),
  connect({
    actions: [userLogic, ['loadUserEvents'], eventFunnelLogic, ['filterForUserIds']],
    values: [userLogic, ['users', 'userEvents'], eventFunnelLogic, ['path', 'filterDescription', 'whitelistUserIds']],
  }),
  actions({
    setFilter: (filterType: FilterType) => ({ filterType }),
    loadPropertyCounts: () => ({}),
    setPropertyOptions: (propertyOptions: Record<string, string[]>) => ({propertyOptions})
  }),
  reducers(({ actions, values }) => ({
    currentFilter: [
      'all-users' as FilterType,
      {
        setFilter: (_, { filterType }) => filterType,
      },
    ],
    propertyOptions: [
      {} as Record<string, string[]>,
      {
        setPropertyOptions: (_, { propertyOptions }) => propertyOptions
      }
    ]
  })),
  selectors({
    usersForSelectedFilter: [
      (s) => [s.currentFilter, s.users, eventFunnelLogic.selectors.whitelistUserIds],
      (filterType, users, whitelistUserIds) => {
        switch (filterType) {
          case 'all-users':
            return users
          case 'anon-users':
            return users.filter((u) => u.isAnon)
          case 'authed-users':
            return users.filter((u) => !u.isAnon)
          case 'filter-by-id':
            return users.filter((u) => (whitelistUserIds?.indexOf(u.id) || -1) > 0)
        }
      },
    ],
  }),
  listeners(({ actions, selectors }) => ({
    [eventFunnelLogic.actionTypes.filterForUserIds]: () => {
      actions.setFilter('filter-by-id')
    },
    loadPropertyCounts: async (_, breakpoint) => {
      const counts = await api.event.propertyCounts()
      const options = Object.entries(counts).reduce(((acc, [k, v]) => ({...acc, [k]: Object.keys(v)})), {})
      actions.setPropertyOptions(options)
    },
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      actions.loadPropertyCounts()
    },
  })),
])
