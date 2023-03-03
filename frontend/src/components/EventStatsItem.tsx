import { Card, Col, List, Row, Statistic, Tag, Timeline } from 'antd'
import { actions, events, kea, listeners, path, reducers, useActions, useValues } from 'kea'
import { loaders } from 'kea-loaders'
import { api, EventStats } from 'lib/api'
import { useState } from 'react'


export interface EventStatsItemProps {
  stats: EventStats
}

export function EventStatsItem(props: EventStatsItemProps): JSX.Element {
  const {stats} = props
  const [open, setOpen] = useState(false);
  return (
  <>
    <Card title={stats.event}>
      <Row align="stretch">
        <Col span={12}>
          <Card style={{height: "100%"}}>
            <Row>
              <Col span={12}><Statistic title="Total count" value={stats.totalFired} /></Col>
              <Col span={12}><Statistic title="Percentage" value={stats.percentage * 100} precision={2} suffix="%" /></Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Timeline mode="left">
              <Timeline.Item label="Most preceded event">{stats.mostPrecededBy.item} ({stats.mostPrecededBy.count})</Timeline.Item>
              <Timeline.Item label="(This event)" color="green">{stats.event}</Timeline.Item>
              <Timeline.Item label="Most followed event">{stats.mostFollowedBy.item} ({stats.mostFollowedBy.count})</Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          
        </Col>
      </Row>
      <Row>
        <Col>
          <List
              header="Event Properties"
              bordered
              itemLayout='vertical'
              dataSource={Object.entries(stats.properties)}
              renderItem={([name, values]) => (
                <List.Item>
                  <Row>
                    <Col span={3}>{name}</Col>
                    <Col span={21} style={{textAlign: "start"}}>{values.map(v => (<Tag>{v.item} ({v.count})</Tag>))}</Col>
                  </Row>
                </List.Item>
              )}>
          </List>
        </Col>
      </Row>
    </Card>
    
  </>)
}