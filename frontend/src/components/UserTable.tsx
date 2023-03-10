import { Card, Form, Radio, Spin, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useActions, useValues } from 'kea'

import { EventTimeline } from './EventTimeline'

import { User } from 'lib/api'
import { userTableLogic } from 'scenes/userTableLogic'

export type FilterType = 'all-users' | 'filter-by-id' | 'anon-users' | 'authed-users'

export function UserTable(): JSX.Element {
  const { setFilter, loadUserEvents } = useActions(userTableLogic)
  const { currentFilter, usersForSelectedFilter, userEvents, filterDescription, propertyOptions } =
    useValues(userTableLogic)

  const stringToFilter = (value: string) => ({ text: value, value: value })

  const columns: ColumnsType<User> = [
    {
      title: 'User ID',
      dataIndex: 'id',
      render: (value, record, i) => (record.isAnon ? record.id : record.email),
      filters: [
        { text: 'Logged in', value: false },
        { text: 'Anonymous user', value: true },
      ],
      onFilter: (value, record) => {
        console.log('onfillter')
        return record.isAnon === value
      },
      width: '25em',
    },
    {
      title: 'Last seen at',
      dataIndex: 'lastSeen',
      render: (value, record, i) => record.lastSeenAt?.toLocaleString('en-US'),
      sorter: (a, b) => a.lastSeenAt.getTime() - b.lastSeenAt.getTime(),
    },
    {
      title: 'Properties',
      dataIndex: 'properties',
      render: (value, record, i) => {
        return Object.entries(record.associatedEventProperties).map((kv, ii) => (
          <Tag key={`${i}-${ii}`}>{kv.join(': ')}</Tag>
        ))
      },
      filters: Object.entries(propertyOptions).map(([k, v]) => ({
        ...stringToFilter(k),
        children: v.map(stringToFilter),
      })),
      filterMode: 'tree',
      onFilter: (value, record) => Object.values(record.associatedEventProperties).indexOf(value as string) >= 0,
    },
  ]

  return (
    <>
      <Card title="Users">
        <Form layout="inline">
          <Form.Item label="Users">
            <Radio.Group
              value={currentFilter}
              onChange={(e) => {
                setFilter(e.target.value)
              }}
            >
              <Radio.Button value="all-users">Show all users</Radio.Button>
              <Radio.Button value="filter-by-id">Show users in funnel only</Radio.Button>
              <Radio.Button value="anon-users">Show only anonymous users</Radio.Button>
              <Radio.Button value="authed-users">Show only authed users</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
        <br />
        <p style={{ textAlign: 'left' }}>
          Showing <strong>{usersForSelectedFilter.length}</strong> users
        </p>
        {currentFilter === 'filter-by-id' && filterDescription && (
          <p style={{ textAlign: 'left' }}>
            <strong>Funnel path</strong>: {filterDescription}
          </p>
        )}
        <br />
        <Table<User>
          bordered
          columns={columns}
          dataSource={usersForSelectedFilter}
          rowKey={(record) => record.id}
          expandRowByClick={true}
          expandable={{
            expandedRowRender: (record) => {
              loadUserEvents(record.id)
              return userEvents[record.id] ? <EventTimeline key={record.id} events={userEvents[record.id]} /> : <Spin />
            },
            rowExpandable: (record) => true,
          }}
        />
      </Card>
    </>
  )
}
