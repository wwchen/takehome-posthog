// Generated by kea-typegen on Fri, 03 Mar 2023 20:10:50 GMT. DO NOT EDIT THIS FILE MANUALLY.

import type { Logic } from 'kea'

import type { GetUsersResponse, User } from '../lib/api'

export interface userLogicType extends Logic {
  actionCreators: {
    loadUsers: () => {
      type: 'load users (src.components.UserTable)'
      payload: {}
    }
    loadUsersSuccess: (
      users: GetUsersResponse,
      payload?: {}
    ) => {
      type: 'load users success (src.components.UserTable)'
      payload: {
        users: GetUsersResponse
        payload?: {}
      }
    }
    loadUsersFailure: (
      error: string,
      errorObject?: any
    ) => {
      type: 'load users failure (src.components.UserTable)'
      payload: {
        error: string
        errorObject?: any
      }
    }
  }
  actionKeys: {
    'load users (src.components.UserTable)': 'loadUsers'
    'load users success (src.components.UserTable)': 'loadUsersSuccess'
    'load users failure (src.components.UserTable)': 'loadUsersFailure'
  }
  actionTypes: {
    loadUsers: 'load users (src.components.UserTable)'
    loadUsersSuccess: 'load users success (src.components.UserTable)'
    loadUsersFailure: 'load users failure (src.components.UserTable)'
  }
  actions: {
    loadUsers: () => void
    loadUsersSuccess: (users: GetUsersResponse, payload?: {}) => void
    loadUsersFailure: (error: string, errorObject?: any) => void
  }
  asyncActions: {
    loadUsers: () => Promise<any>
    loadUsersSuccess: (users: GetUsersResponse, payload?: {}) => Promise<any>
    loadUsersFailure: (error: string, errorObject?: any) => Promise<any>
  }
  defaults: {
    users: User[]
    usersLoading: boolean
  }
  events: {
    afterMount: () => void
  }
  key: undefined
  listeners: {}
  path: ['src', 'components', 'UserTable']
  pathString: 'src.components.UserTable'
  props: Record<string, unknown>
  reducer: (
    state: any,
    action: any,
    fullState: any
  ) => {
    users: User[]
    usersLoading: boolean
  }
  reducers: {
    users: (state: User[], action: any, fullState: any) => User[]
    usersLoading: (state: boolean, action: any, fullState: any) => boolean
  }
  selector: (state: any) => {
    users: User[]
    usersLoading: boolean
  }
  selectors: {
    users: (state: any, props?: any) => User[]
    usersLoading: (state: any, props?: any) => boolean
  }
  sharedListeners: {}
  values: {
    users: User[]
    usersLoading: boolean
  }
  _isKea: true
  _isKeaWithKey: false
}