import axios from "axios";


const client = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Access-Control-Allow-Origin': '*' },
})

export type NextStepItem = {
  event?: string
  count: number
}
export type ExploreNextResponse = NextStepItem[]

export const api = {
  funnel: {
    async exploreNext(path: string[]): Promise<ExploreNextResponse> {
      return client.post('event-funnel/next-events', {path})
        .then((response) => response.data)
    }
  }
}