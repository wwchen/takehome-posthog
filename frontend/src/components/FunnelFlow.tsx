import { useEffect, useState } from 'react'

import { Sankey } from '@ant-design/plots'
import { api } from 'lib/api'

export function FunnelFlow() {
  const [data, setData] = useState([])

  useEffect(() => {
    api.funnel
      .edges()
      .then((r) => setData(r as any))
      .catch((error) => {
        console.warn('fetch data failed', error)
      })
  }, [])

  const config = {
    data,
    sourceField: 'from',
    targetField: 'to',
    weightField: 'count',
    colorField: 'type', // or seriesField in some cases
    color: (datum: Record<string, any>) => {
      if ((datum?.name || '').startsWith('*')) {
        return 'red'
      }
      return 'green'
    },
    edgeStyle: {
      fill: '#ccc',
      fillOpacity: 0.4,
    },
  }

  return <Sankey {...config} />
}
