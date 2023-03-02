import { Button, Card, Col, Radio, Row, Space } from 'antd'
import { AxiosError } from 'axios'
import { actions, events, kea, listeners, path, reducers, useActions, useValues } from 'kea'
import { loaders } from 'kea-loaders'

import { api, NextStepItem } from 'lib/api'
import { sum } from 'util/std'
import type { explorationLogicType } from './FunnelExplorationType'

export type StepKey = string
export type Step = {
  index: number,
  title: StepKey,
  totalCount: number,
  dropoffCount: number,
  nextSteps: NextStep[]
}
export type NextStep = Pick<Step, 'title' | 'totalCount'>
export type FlowDb = Step[]
export type Path = StepKey[]

function emptyDb(): FlowDb {
  return [
    {
      index: 0,
      title: "Root",
      totalCount: 0,
      dropoffCount: 0,
      nextSteps: []
    }
  ]
}

const isDropoff = (item: NextStepItem) => ( !item.event )

function toStep(item: NextStepItem): NextStep {
  if (!item.event) {
    throw new Error("cannot map drop off events to next step")
  }
  return {
    title: item.event,
    totalCount: item.count,
  }
}

export function FunnelExploration(): JSX.Element {
  const { setPath } = useActions(explorationLogic)
  const { path, results } = useValues(explorationLogic)

  function onClick(item: NextStep, i: number) {
    setPath(path.slice(0, i).concat(item.title))
  }

  return (
    <>
      <Row>
        {results.map((step, i) => {
          // <Col><Card title="Root" style={{height: "100%"}}>Choose your own adventure</Card></Col>
          // const options = step.nextSteps.sort((a, b) => (a.event && b.event ? b.count - a.count : a.event ? -1 : 1))
          return (
            <Col key={i}>
              <Card title={`Step ${i+1} (${step.totalCount})`}>
                <Radio.Group onChange={(e) => onClick(e.target.value, i)}>
                  <Space direction="vertical">
                    {step.nextSteps.map((item) => (
                      <Radio.Button style={{ width: '100%' }} value={item}>
                        {item.title} ({item.totalCount})
                      </Radio.Button>
                    ))}
                    <Radio.Button style={{ width: '100%' }} value="dropoff" disabled={true}>
                      drop off({step.dropoffCount})
                    </Radio.Button>
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
          )
        })}
      </Row>
    </>
  )
}

export const explorationLogic = kea<explorationLogicType>([
  path(['src', 'components', 'FunnelExploration']),
  actions({
    setResults: (i: number, step: Step) => ({ i, step }),
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
  })),
  listeners(({ actions, values }) => ({
    setPath: async (path, breakpoint) => {
      await breakpoint(300)
      try {
        const results: NextStepItem[] = await api.funnel.exploreNext(path)
        const dropoffEvents = results.filter(isDropoff)
        const nextEvents = results.filter(i => !isDropoff(i))
        const step: Step = {
          index: path.length,
          title: path.slice(-1)[0],
          totalCount: sum(results.map(i => i.count)),
          dropoffCount: sum(dropoffEvents.map(i => i.count)) || 0,
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
