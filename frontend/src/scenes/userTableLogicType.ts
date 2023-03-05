// Generated by kea-typegen on Sat, 04 Mar 2023 16:27:59 GMT. DO NOT EDIT THIS FILE MANUALLY.

import type { Logic } from 'kea'

import type { Event, User } from '../lib/api'
import type { FilterType } from '../components/UserTable'

export interface userTableLogicType extends Logic {
  actionCreators: {
    loadUserEvents: (userId: string) => {
      type: 'load user events (src.scenes.userTableLogic)'
      payload: {
        userId: string
      }
    }
    filterForUserIds: (
      filterDescription: string,
      whitelistUserIds: string[]
    ) => {
      type: 'filter for user ids (src.scenes.userTableLogic)'
      payload: {
        filterDescription: string
        whitelistUserIds: string[]
      }
    }
    setFilter: (filterType: FilterType) => {
      type: 'set filter (src.scenes.userTableLogic)'
      payload: {
        filterType: FilterType
      }
    }
    loadPropertyCounts: () => {
      type: 'load property counts (src.scenes.userTableLogic)'
      payload: {}
    }
    setPropertyOptions: (propertyOptions: Record<string, string[]>) => {
      type: 'set property options (src.scenes.userTableLogic)'
      payload: {
        propertyOptions: Record<string, string[]>
      }
    }
  }
  actionKeys: {
    'load user events (src.scenes.userTableLogic)': 'loadUserEvents'
    'filter for user ids (src.scenes.userTableLogic)': 'filterForUserIds'
    'set filter (src.scenes.userTableLogic)': 'setFilter'
    'load property counts (src.scenes.userTableLogic)': 'loadPropertyCounts'
    'set property options (src.scenes.userTableLogic)': 'setPropertyOptions'
  }
  actionTypes: {
    loadUserEvents: 'load user events (src.scenes.userTableLogic)'
    filterForUserIds: 'filter for user ids (src.scenes.userTableLogic)'
    setFilter: 'set filter (src.scenes.userTableLogic)'
    loadPropertyCounts: 'load property counts (src.scenes.userTableLogic)'
    setPropertyOptions: 'set property options (src.scenes.userTableLogic)'
  }
  actions: {
    loadUserEvents: (userId: string) => void
    filterForUserIds: (filterDescription: string, whitelistUserIds: string[]) => void
    setFilter: (filterType: FilterType) => void
    loadPropertyCounts: () => void
    setPropertyOptions: (propertyOptions: Record<string, string[]>) => void
  }
  asyncActions: {
    loadUserEvents: (userId: string) => Promise<any>
    filterForUserIds: (filterDescription: string, whitelistUserIds: string[]) => Promise<any>
    setFilter: (filterType: FilterType) => Promise<any>
    loadPropertyCounts: () => Promise<any>
    setPropertyOptions: (propertyOptions: Record<string, string[]>) => Promise<any>
  }
  defaults: {
    currentFilter: FilterType
    propertyOptions: Record<string, string[]>
  }
  events: {
    afterMount: () => void
  }
  key: undefined
  listeners: {
    'filter for user ids (src.scenes.eventFunnelLogic)': ((
      action: {
        type: 'filter for user ids (src.scenes.eventFunnelLogic)'
        payload: {
          filterDescription: string
          whitelistUserIds: string[]
        }
      },
      previousState: any
    ) => void | Promise<void>)[]
    loadPropertyCounts: ((
      action: {
        type: 'load property counts (src.scenes.userTableLogic)'
        payload: {}
      },
      previousState: any
    ) => void | Promise<void>)[]
  }
  path: ['src', 'scenes', 'userTableLogic']
  pathString: 'src.scenes.userTableLogic'
  props: Record<string, unknown>
  reducer: (
    state: any,
    action: any,
    fullState: any
  ) => {
    currentFilter: FilterType
    propertyOptions: Record<string, string[]>
  }
  reducers: {
    currentFilter: (state: FilterType, action: any, fullState: any) => FilterType
    propertyOptions: (state: Record<string, string[]>, action: any, fullState: any) => Record<string, string[]>
  }
  selector: (state: any) => {
    currentFilter: FilterType
    propertyOptions: Record<string, string[]>
  }
  selectors: {
    currentFilter: (state: any, props?: any) => FilterType
    propertyOptions: (state: any, props?: any) => Record<string, string[]>
    users: (state: any, props?: any) => User[]
    userEvents: (state: any, props?: any) => Record<string, Event[]>
    path: (state: any, props?: any) => string[]
    whitelistUserIds: (state: any, props?: any) => string[]
    filterDescription: (state: any, props?: any) => string
    usersForSelectedFilter: (state: any, props?: any) => User[]
  }
  sharedListeners: {}
  values: {
    currentFilter: FilterType
    propertyOptions: Record<string, string[]>
    users: User[]
    userEvents: Record<string, Event[]>
    path: string[]
    whitelistUserIds: string[]
    filterDescription: string
    usersForSelectedFilter: User[]
  }
  _isKea: true
  _isKeaWithKey: false
  __keaTypeGenInternalSelectorTypes: {
    usersForSelectedFilter: (
      currentFilter: FilterType,
      users: User[],
      whitelistUserIds: string[]
    ) => User[]
  }
  __keaTypeGenInternalReducerActions: {
    'filter for user ids (src.scenes.eventFunnelLogic)': (
      filterDescription: string,
      whitelistUserIds: string[]
    ) => {
      type: 'filter for user ids (src.scenes.eventFunnelLogic)'
      payload: {
        filterDescription: string
        whitelistUserIds: string[]
      }
    }
  }
}
