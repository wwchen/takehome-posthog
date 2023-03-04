import { actions, connect, kea, path, reducers, selectors, listeners } from 'kea'

import { FilterType } from 'components/UserTable'
import { userLogic } from './userLogic'

import { eventFunnelLogic } from './eventFunnelLogic'
import type { userTableLogicType } from './userTableLogicType'

export const userTableLogic = kea<userTableLogicType>([
  path(['src', 'scenes', 'userTableLogic']),
  connect({
    actions: [userLogic, ['loadUserEvents'], eventFunnelLogic, ['filterForUserIds']],
    values: [userLogic, ['users', 'userEvents'], eventFunnelLogic, ['whitelistUserIds']],
  }),
  actions({
    setFilter: (filterType: FilterType) => ({ filterType }),
  }),

  reducers(({ actions, values }) => ({
    currentFilter: [
      'all-users' as FilterType,
      {
        setFilter: (_, { filterType }) => filterType,
      },
    ],
  })),
  selectors({
    usersForSelectedFilter: [
      (s) => [s.currentFilter, s.users, eventFunnelLogic.selectors.whitelistUserIds],
      (filterType, users, whitelistUserIds) => {
        console.log('selector caleld')
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
  })),
])
