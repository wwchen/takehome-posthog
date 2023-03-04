import { actions, connect, kea, selectors, path, reducers } from 'kea'
import { loaders } from 'kea-loaders'

import { FilterType } from 'components/UserTable'
import { userLogic } from './userLogic'

import type { userTableLogicType } from './userTableLogicType'
import { User } from 'lib/api'

export const userTableLogic = kea<userTableLogicType>([
  path(['src', 'scenes', 'userTableLogic']),
  connect({
    actions: [userLogic, ['loadUserEvents']],
    values: [userLogic, ['users', 'userEvents']],
  }),
  actions({
    setFilter: (filterType: FilterType, whitelistUserIds?: string[]) => ({ filterType, whitelistUserIds }),
  }),
  
  reducers(({ actions, values }) => ({
    // filteredUsers: [
    //   [] as User[],
    //   {
    //     setFilter: (_, { filterType, userIds }) => {
    //       // console.log(`set filter to ${filterType}`)
    //       const allUsers = userLogic.values.users
    //       // console.log(allUsers.length)
    //       // console.log(values.filteredUsers.length)
    //       // return [...allUsers]
    //       switch (values.currentFilter) {
    //         case 'all-users':
    //           return allUsers
    //         case 'anon-users':
    //           return allUsers.filter((u) => u.isAnon)
    //         case 'authed-users':
    //           return allUsers.filter((u) => !u.isAnon)
    //         case 'filter-by-id':
    //           return allUsers.filter((u) => (userIds?.indexOf(u.id) || -1) > 0)
    //       }
    //     },
    //     [userLogic.actionTypes.setUsersSuccess]: (_, { users }) => (users)
    //   },
    // ],
    // foobar: [
    //   "defa",
    //   {
    //     setFilter: () => {
    //       console.log("asdfasdf", values.foobar)
    //       return "test"
    //     }
    //   }
    // ],
    currentFilter: [
      {filterType: 'all-users'} as { filterType: FilterType, whitelistUserIds?: string[] },
      {
        setFilter: (_, args) => args,
      },
    ],
  })),
  selectors({
    usersForSelectedFilter: [
      (s) => [s.currentFilter, s.users],
      (filter, users) => {
        switch (filter.filterType) {
          case 'all-users':
            return users
          case 'anon-users':
            return users.filter((u) => u.isAnon)
          case 'authed-users':
            return users.filter((u) => !u.isAnon)
          case 'filter-by-id':
            return users.filter((u) => (filter.whitelistUserIds?.indexOf(u.id) || -1) > 0)
        }
      }
    ]
  }),
])
