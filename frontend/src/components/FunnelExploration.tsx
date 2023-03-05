import { Button, Card, Col, Popover, Radio, Row, Space } from 'antd'
import { useActions, useValues } from 'kea'

import { MoreOutlined } from '@ant-design/icons'
import { eventFunnelLogic, NextStep } from 'scenes/eventFunnelLogic'
import { EventDetails } from './EventDetails'
import { FunnelStepButton } from './FunnelStepButton'

export function FunnelExploration(): JSX.Element {
  const { setPath, filterForUserIds } = useActions(eventFunnelLogic)
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
              <Card title={`Step ${i + 1}`}>
                <Radio.Group onChange={(e) => onClick(e.target.value, i)} buttonStyle="outline">
                  <Space direction="vertical">
                    {step.nextSteps.map((item) => (
                      <>
                        <FunnelStepButton
                          stepKey={[...results.slice(1, i + 1).map((s) => s.title), item.title].join(' > ')}
                          value={item}
                          content={`${item.title} (${item.totalCount})`}
                          button1Label="Event summary details"
                          button1={
                            <Popover trigger="click" content={<EventDetails target={item.title} />}>
                              <Button icon={<MoreOutlined />} />
                            </Popover>
                          }
                          onFilterClick={(_, key) => filterForUserIds(key.toString(), item.matchingUserIds)}
                        />
                      </>
                    ))}
                    <FunnelStepButton
                      stepKey={[...results.slice(1, i + 1).map((s) => s.title), 'drop off'].join(' > ')}
                      value="dropoff"
                      content={`Drop off (${step.dropoffCount})`}
                      disabled
                      onFilterClick={(_, key) => filterForUserIds(key.toString(), step.dropoffUserIds)}
                    />
                    <FunnelStepButton
                      stepKey={[...results.slice(1, i + 1).map((s) => s.title), 'total'].join(' > ')}
                      value="total"
                      content={`Total users in this step (${step.totalCount})`}
                      disabled
                      onFilterClick={(_, key) => filterForUserIds(key.toString(), step.matchingUserIds)}
                    />
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
