import { Button } from 'antd'
import { kea, useValues, useActions, actions, reducers, listeners, path } from 'kea'

import type { explorationLogicType } from './FunnelExplorationType'

export function FunnelExploration(): JSX.Element {
  const { setFunnelPath } = useActions(explorationLogic)
  const { funnelPath } = useValues(explorationLogic)
  // const { querySource } = useValues(funnelDataLogic(insightProps))

  return (
    <>
      <Button onClick={() => setFunnelPath('foo')}>Click me</Button>
    </>
  )
}

export const explorationLogic = kea<explorationLogicType>([
  path(['src', 'components', 'FunnelExploration']),
  actions({
    setFunnelPath: (funnelPath) => ({ funnelPath }),
  }),
  reducers({
    funnelPath: [
      [],
      {
        setFunnelPath: (_, { funnelPath }) => funnelPath,
      },
    ],
  }),
  listeners({
    setFunnelPath: () => {},
  }),
])

/*
distribution/impressionCount(event) -> {impressionCount: userCount}

funnel exploration step through
- first event
- possible next events
- 
*/
