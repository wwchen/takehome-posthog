import { Button, Card, Col, Row } from 'antd'
import { AxiosError } from 'axios'
import { actions, events, kea, listeners, path, reducers, useActions, useValues } from 'kea'
import { loaders } from 'kea-loaders'

import { api, NextStepItem } from 'lib/api'
import type { explorationLogicType } from './FunnelExplorationType'

export function FunnelExploration(): JSX.Element {
  const { setPath } = useActions(explorationLogic)
  const { path, results } = useValues(explorationLogic)

  function onClick(item: NextStepItem, i: number) {
    item.event && setPath(path.slice(0, i).concat(item.event))
  }

  return (
    <>
    <Row>
      {results.map((steps, i) => {
        const title = path[i-1] || "Root"
        // console.log(`${i}, ${title}`)
        // console.log(path.join("|"))
        return (
          <Col key={i}>
            <Card title={title}>
              {steps.map((item) => (
                <>
                  <Button onClick={() => onClick(item, i)}>{item.event || "<drop off>"} ({item.count})</Button><br />
                </>
              ))}
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
    setResults: (i: number, results: NextStepItem[]) => ({i, results}),
  }),
  loaders(({ actions, values }) => ({
    path: [
      [] as string[],
      {
        setPath: (path: string[]) => {
          console.log(`set path:`, path)
          return path
        },
      }
    ],
    results: [
      [] as NextStepItem[][],
      {
        setResults: ({i, results}) => {
          const foo =  [...values.results.slice(0, i-1), results]
          console.log(`set results:`, foo)
          return foo
        },
      }
    ]
  })),
  listeners(({ actions, values }) => ({
    setPath: async (path, breakpoint) => {
      await breakpoint(300)
      try {
        const results = (await api.funnel.exploreNext(path))
        actions.setResults(path.length+1, results as NextStepItem[])
        breakpoint()
      } catch (e) {
        actions.setResultsFailure('error getting funnel results', e)
        console.warn('error getting funnel results', e)
      }
    }
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      console.log("afterMount called")
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
