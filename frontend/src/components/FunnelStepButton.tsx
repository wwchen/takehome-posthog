import { Radio, Space, Tooltip } from 'antd'

export interface FunnelStepButtonProps {
  content: string
  value: any
  disabled?: boolean
  button1Label?: string
  button1?: JSX.Element
  button2Label?: string
  button2?: JSX.Element
}

export function FunnelStepButton(props: FunnelStepButtonProps): JSX.Element {
  return (
    <>
    <Space.Compact
      block
      direction="horizontal"
      style={{ width: '100%', verticalAlign: 'middle' }}
      size="middle"
    >
      <Radio.Button style={{ width: '100%' }} value={props.value} disabled={props.disabled}>
        {props.content}
      </Radio.Button>
      {props.button1 && (
        <Tooltip title={props.button1Label}>
          {props.button1}
        </Tooltip>
      )}
      {props.button2 && (
        <Tooltip title={props.button2Label}>
          {props.button2}
        </Tooltip>
      )}
    </Space.Compact>
    </>
  )
}