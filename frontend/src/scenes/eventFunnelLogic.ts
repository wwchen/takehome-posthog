import { actions, events, kea, listeners, path, reducers } from 'kea'
import { loaders } from 'kea-loaders'

import { api, NextStepItem } from 'lib/api'
import { sum } from 'util/std'

import type { eventFunnelLogicType } from './eventFunnelLogicType'

export type StepKey = string
export type Step = {
  index: number
  title: StepKey
  totalCount: number
  matchingUserIds: string[]
  dropoffCount: number
  dropoffUserIds: string[]
  nextSteps: NextStep[]
}
export type NextStep = Pick<Step, 'title' | 'totalCount' | 'matchingUserIds'>
export type FlowDb = Step[]
export type Path = StepKey[]

function emptyDb(): FlowDb {
  return [
    {
      index: 0,
      title: 'Root',
      totalCount: 0,
      matchingUserIds: [],
      dropoffCount: 0,
      dropoffUserIds: [],
      nextSteps: [],
    },
  ]
}

const isDropoff = (item: NextStepItem) => !item.event

function toStep(item: NextStepItem): NextStep {
  if (!item.event) {
    throw new Error('cannot map drop off events to next step')
  }
  return {
    title: item.event,
    totalCount: item.count,
    matchingUserIds: item.matchingUserIds,
  }
}

export const eventFunnelLogic = kea<eventFunnelLogicType>([
  path(['src', 'scenes', 'eventFunnelLogic']),
  actions({
    setResults: (i: number, step: Step) => ({ i, step }),
    filterForUserIds: (filterDescription: string, whitelistUserIds: string[]) => ({
      filterDescription,
      whitelistUserIds,
    }),
  }),
  loaders(({ actions, values }) => ({
    path: [
      [] as string[],
      {
        setPath: (path: string[]) => {
          return path
        },
      },
    ],
    results: [
      emptyDb(),
      {
        setResults: ({ i, step }) => {
          return [...values.results.slice(0, i - 1), step]
        },
      },
    ],
    whitelistUserIds: [
      [] as string[],
      {
        filterForUserIds: ({ filterDescription, whitelistUserIds }) => {
          console.log(`filtering for ${whitelistUserIds.length}: ${filterDescription}`)
          return whitelistUserIds
        },
      },
    ],
  })),
  reducers(({ actions, values }) => ({
    filterDescription: [
      '' as string,
      {
        filterForUserIds: (_, { filterDescription }) => filterDescription,
      },
    ],
  })),
  listeners(({ actions, values }) => ({
    setPath: async (path, breakpoint) => {
      await breakpoint(300)
      try {
        const results: NextStepItem[] = await api.funnel.exploreNext(path)
        const dropoffEvents = results.filter(isDropoff)
        const nextEvents = results.filter((i) => !isDropoff(i))
        const step: Step = {
          index: path.length,
          title: path.slice(-1)[0],
          totalCount: sum(results.map((i) => i.count)),
          matchingUserIds: results.flatMap((i) => i.matchingUserIds),
          dropoffCount: sum(dropoffEvents.map((i) => i.count)) || 0,
          dropoffUserIds: dropoffEvents.flatMap((i) => i.matchingUserIds),
          nextSteps: nextEvents.map(toStep),
        }
        actions.setResults(path.length + 1, step)
        breakpoint()
      } catch (e) {
        actions.setResultsFailure('error getting funnel results', e)
        console.warn('error getting funnel results', e)
      }
    },
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      actions.setPath(values.path)
    },
  })),
])

/*
distribution/impressionCount(event) -> {impressionCount: userCount}

explore-funnel {path: []} -> {[nextPath]: count, _dropoff: count}

funnel exploration step through
- first event
- possible next events
- 
*/
