import { FilterOutlined } from '@ant-design/icons'
import { Button, Radio, Space, Tooltip } from 'antd'
import React from 'react'

export interface FunnelStepButtonProps {
  stepKey: React.Key
  content: string
  value: any
  disabled?: boolean
  button1Label?: string
  button1?: JSX.Element
  onFilterClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: React.Key
  ) => any
}

export function FunnelStepButton(props: FunnelStepButtonProps): JSX.Element {
  return (
    <>
      <Space.Compact block direction="horizontal" style={{ width: '100%', verticalAlign: 'middle' }} size="middle">
        <Radio.Button style={{ width: '100%' }} value={props.value} disabled={props.disabled}>
          {props.content}
        </Radio.Button>
        {props.button1 && <Tooltip title={props.button1Label}>{props.button1}</Tooltip>}
        <Tooltip title="Filter for users in this funnel path">
          <Button
            key={props.stepKey}
            onClick={(e) => props.onFilterClick(e, props.stepKey)}
            icon={<FilterOutlined />}
          />
        </Tooltip>
      </Space.Compact>
    </>
  )
}
