import axios from 'axios'
import { config } from 'util/env'

const client = axios.create({
  baseURL: config.baseUrl,
  headers: { 'Access-Control-Allow-Origin': '*' },
})
// https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
client.interceptors.response.use((originalResponse) => {
  handleDates(originalResponse.data)
  return originalResponse
})

// modified version of https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && !isNaN(new Date(value as string).valueOf())
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object') return body
  for (const key of Object.keys(body)) {
    const value = body[key]
    if (isIsoDateString(value)) body[key] = new Date(value)
    else if (typeof value === 'object') handleDates(value)
  }
}

export type NextStepItem = {
  event?: string
  count: number
}
export type ExploreNextResponse = NextStepItem[]

export type Edge = {
  from: String
  to: String
  count: number
}
export type EdgesResponse = Edge[]

export type AggEvent = {
  event: string
  lastFired: Date
  properties: Record<string, string>
  userIds: string[]
}
export type DetailsResponse = AggEvent[]

export type ItemWithCount = {
  item: string
  count: number
}
export type EventStats = {
  event: string
  totalFired: number
  percentage: number
  mostPrecededBy: ItemWithCount
  mostFollowedBy: ItemWithCount
  lastFiredAt: Date
  properties: Record<string, ItemWithCount[]>
}
export type EventStatsResponse = EventStats[]

export const api = {
  funnel: {
    async exploreNext(path: string[]): Promise<ExploreNextResponse> {
      return client.post('event-funnel/next-events', { path }).then((response) => response.data)
    },
    async edges(): Promise<EdgesResponse> {
      return client.get('event-funnel/edges').then((response) => response.data)
    },
    async details(path: string[]): Promise<DetailsResponse> {
      return client.post('event-funnel/details', { path }).then((response) => response.data)
    },
  },
  event: {
    async stats(): Promise<EventStatsResponse> {
      return client.get('event/stats').then((response) => response.data)
    },
  },
}
