import { Button, Card, Col, Radio, Row, Space } from 'antd'
import { AxiosError } from 'axios'
import { actions, events, kea, listeners, path, reducers, useActions, useValues } from 'kea'
import { loaders } from 'kea-loaders'

import { api, NextStepItem } from 'lib/api'
import type { explorationLogicType } from './FunnelExplorationType'

type Step = {
  index: number,
  title: string,
  totalCount: number,
  nextSteps: Step[]
}

export function FunnelExploration(): JSX.Element {
  const { setPath } = useActions(explorationLogic)
  const { path, results } = useValues(explorationLogic)

  function onClick(item: NextStepItem, i: number) {
    item.event && setPath(path.slice(0, i).concat(item.event))
  }

  return (
    <>
      <Row>
        <Col><Card title="Root" style={{height: "100%"}}>Choose your own adventure</Card></Col>
        {results.map((steps, i) => {
          const title = path[i - 1] || 'Root'
          const options = steps.sort((a, b) => (a.event && b.event ? b.count - a.count : a.event ? -1 : 1))
          return (
            <Col key={i}>
              <Card title={`Step ${i+1}`}>
                <Radio.Group onChange={(e) => onClick(e.target.value, i)}>
                  <Space direction="vertical">
                    {options.map((item) => (
                      <Radio.Button style={{ width: '100%' }} value={item} disabled={!item.event}>
                        {item.event || '<drop off>'} ({item.count})
                      </Radio.Button>
                    ))}
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
    setResults: (i: number, results: NextStepItem[]) => ({ i, results }),
  }),
  loaders(({ actions, values }) => ({
    path: [
      [] as string[],
      {
        setPath: (path: string[]) => {
          console.log(`set path:`, path)
          return path
        },
      },
    ],
    results: [
      [] as NextStepItem[][],
      {
        setResults: ({ i, results }) => {
          const foo = [...values.results.slice(0, i - 1), results]
          console.log(`set results:`, foo)
          return foo
        },
      },
    ],
  })),
  listeners(({ actions, values }) => ({
    setPath: async (path, breakpoint) => {
      await breakpoint(300)
      try {
        const results = await api.funnel.exploreNext(path)
        actions.setResults(path.length + 1, results as NextStepItem[])
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
