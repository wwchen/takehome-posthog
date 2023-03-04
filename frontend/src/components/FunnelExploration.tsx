import { Button, Card, Col, Popover, Radio, Row, Space } from 'antd'
import { useActions, useValues } from 'kea'

import { FilterOutlined, MoreOutlined } from '@ant-design/icons'
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
              <Card title={`Step ${i + 1} (${step.totalCount})`}>
                <Radio.Group onChange={(e) => onClick(e.target.value, i)} buttonStyle="solid">
                  <Space direction="vertical">
                    {step.nextSteps.map((item) => (
                      <>
                        <FunnelStepButton
                          value={item}
                          content={`${item.title} (${item.totalCount})`}
                          button1Label="Event details"
                          button1={
                            <Popover trigger="hover" content={<EventDetails target={item.title} />}>
                              <Button icon={<MoreOutlined />} />
                            </Popover>
                          }
                          button2Label="Filter"
                          button2={
                            <Button onClick={() => filterForUserIds(item.matchingUserIds)} icon={<FilterOutlined />} />
                          }
                        />
                      </>
                    ))}
                    <FunnelStepButton
                      value="dropoff"
                      content={`drop off (${step.dropoffCount})`}
                      disabled
                      button1Label="Filter"
                      button1={
                        <Button onClick={() => filterForUserIds(step.dropoffUserIds)} icon={<FilterOutlined />} />
                      }
                    />
                    <FunnelStepButton
                      value="total"
                      content={`Total in step (${step.totalCount})`}
                      disabled
                      button1Label="Filter"
                      button1={
                        <Button onClick={() => filterForUserIds(step.matchingUserIds)} icon={<FilterOutlined />} />
                      }
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
