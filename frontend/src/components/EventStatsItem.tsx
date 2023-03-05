import { Card, Col, Descriptions, Row, Statistic, Tag, Timeline } from 'antd'
import { EventStats } from 'lib/api'
import { useState } from 'react'

export interface EventStatsItemProps {
  stats: EventStats
}

export function EventStatsItem(props: EventStatsItemProps): JSX.Element {
  const { stats } = props
  const [open, setOpen] = useState(false)
  return (
    <>
      {/* <Card title={`Event details for: '${stats.event}'`} style={{ maxWidth: '60em' }}> */}
      <Card>
        <Row>
          {/* top left card */}
          <Col span={24}>
            <Card title="Statistics" style={{ height: '100%' }} type="inner">
              <Row gutter={[14, 14]}>
                <Col span={12}>
                  <Statistic title="Total count" value={stats.totalFired} />
                </Col>
                <Col span={12}>
                  <Statistic title="Percentage" value={stats.percentage * 100} precision={2} suffix="%" />
                </Col>
                <Col span={24}>
                  <Statistic title="Last fired at" value={stats.lastFiredAt.toLocaleString('en-US')} />
                </Col>
              </Row>
            </Card>
          </Col>
          {/* top right card */}
          <Col span={24}>
            <Card title="Context" type="inner">
              <Timeline
                mode="left"
                items={[
                  {
                    label: 'Most preceded event',
                    children: `${stats.mostPrecededBy.item} (${stats.mostPrecededBy.count})`,
                  },
                  {
                    label: '(This event)',
                    children: `${stats.event}`,
                  },
                  {
                    label: 'Most followed event',
                    children: `${stats.mostFollowedBy.item} (${stats.mostFollowedBy.count})`,
                  },
                ]}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="All captured event properties" type="inner">
              <Descriptions bordered layout="horizontal" column={1} size="small" contentStyle={{ textAlign: 'left' }}>
                {Object.entries(stats.properties).map(([k, v]) => (
                  <Descriptions.Item label={k}>
                    {v
                      .sort((a, b) => b.count - a.count)
                      .map((itemWithCount) => (
                        <Tag>
                          {itemWithCount.item} ({itemWithCount.count})
                        </Tag>
                      ))}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  )
}
