import { actions, events, kea, listeners, path } from 'kea'
import { loaders } from 'kea-loaders'

import { api, Event, User } from 'lib/api'

import type { userLogicType } from './userLogicType'

export const userLogic = kea<userLogicType>([
  path(['src', 'scenes', 'userLogic']),
  actions({
    loadUsers: () => ({}),
    loadUserEvents: (userId: string) => ({ userId }),
    setUsers: (users: User[]) => ({ users }),
    setUserEvents: (userId: string, events: Event[]) => ({ userId, events }),
  }),
  loaders(({ actions, values }) => ({
    users: [
      [] as User[],
      {
        setUsers: ({ users }) => {
          return users
        },
      },
    ],
    userEvents: [
      {} as Record<string, Event[]>,
      {
        setUserEvents: ({ userId, events }) => ({
          ...values.userEvents,
          [userId]: events,
        }),
      },
    ],
  })),
  listeners(({ actions, values }) => ({
    loadUsers: async () => {
      actions.setUsers(await api.user.getAll())
    },
    loadUserEvents: async ({ userId }, breakpoint) => {
      if (!values.userEvents[userId]) {
        const events = await api.event.userEvent(userId)
        breakpoint()
        actions.setUserEvents(userId, events)
      }
    },
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      actions.loadUsers()
    },
  })),
])
