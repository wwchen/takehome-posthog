import { Button, Card, Col, Popover, Radio, Row, Space, Tooltip } from 'antd'
import { useActions, useValues } from 'kea'

import { MoreOutlined, FilterOutlined } from '@ant-design/icons'
import { eventFunnelLogic, NextStep } from 'scenes/eventFunnelLogic'
import { EventDetails } from './EventDetails'

export function FunnelStep(): JSX.Element {
  return <></>
}

export function FunnelExploration(): JSX.Element {
  const { setPath } = useActions(eventFunnelLogic)
  const { path, results } = useValues(eventFunnelLogic)

  function onClick(item: NextStep, i: number) {
    setPath(path.slice(0, i).concat(item.title))
  }

  return (
    <>
      <Row>
        {results.map((step, i) => {
          return (
            <Col key={i}>
              <Card title={`Step ${i + 1} (${step.totalCount})`}>
                <Radio.Group onChange={(e) => onClick(e.target.value, i)} buttonStyle="solid">
                  <Space direction="vertical">
                    {step.nextSteps.map((item) => (
                      <Space.Compact
                        block
                        direction="horizontal"
                        style={{ width: '100%', verticalAlign: 'middle' }}
                        size="middle"
                      >
                        <Radio.Button style={{ width: '100%' }} value={item}>
                          {item.title} ({item.totalCount})
                        </Radio.Button>
                        <Tooltip title="Event details">
                          <Popover trigger="hover" content={<EventDetails target={item.title} />}>
                            <Button icon={<MoreOutlined />} />
                          </Popover>
                        </Tooltip>
                        <Tooltip title="Filter">
                          <Button icon={<FilterOutlined />} />
                        </Tooltip>
                      </Space.Compact>
                    ))}
                    {/* drop off */}
                    <Space.Compact
                      block
                      direction="horizontal"
                      style={{ width: '100%', verticalAlign: 'middle' }}
                      size="middle"
                    >
                      <Radio.Button style={{ width: '100%' }} value="dropoff" disabled={true}>
                        drop off({step.dropoffCount})
                      </Radio.Button>
                      <Tooltip title="Filter">
                        <Button icon={<FilterOutlined />} />
                      </Tooltip>
                    </Space.Compact>
                    {/* total */}
                    <Space.Compact
                      block
                      direction="horizontal"
                      style={{ width: '100%', verticalAlign: 'middle' }}
                      size="middle"
                    >
                      <Radio.Button style={{ width: '100%' }} value="total" disabled={true}>
                        total in step ({step.totalCount})
                      </Radio.Button>
                      <Tooltip title="Filter">
                        <Button icon={<FilterOutlined />} />
                      </Tooltip>
                    </Space.Compact>
                    {/* end */}
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
          )
        })}
      </Row>
      {/* <Row>
        <Col>
          {details.map(detail => (
            <Descriptions title="Details" bordered size="default" column={1}>
              <Descriptions.Item label="Event name">{detail.event}</Descriptions.Item>
              <Descriptions.Item label="Last fired at">{detail.lastFired.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Properties"><EventProperty options={detail.properties} /></Descriptions.Item>
            </Descriptions>
          ))}
          
        </Col>
      </Row> */}
    </>
  )
}
