import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Form, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { actions, events, kea, listeners, path, useActions, useValues } from 'kea'
import { loaders } from 'kea-loaders'

import { api, User } from 'lib/api'

import type { userLogicType } from './UserTableType'

export function UserTable(): JSX.Element {
  const { } = useActions(userLogic)
  const { users } = useValues(userLogic)

  const columns: ColumnsType<User> = [
    {
      title: 'Logged in',
      dataIndex: 'isAnon',
      render: ((value, record, i) => !!!record.isAnon ? <CheckOutlined /> : <CloseOutlined />)
    },
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Last seen at',
      dataIndex: 'lastSeenAt',
      render: ((value, record, i) => record.lastSeenAt?.toLocaleString('en-US'))
    },
  ]

  return (
    <>
      <Form component={false}>
        <Table bordered columns={columns} dataSource={users} />
      </Form>
    </>
  )
}

export const userLogic = kea<userLogicType>([
  path(['src', 'components', 'UserTable']),
  actions({
    loadUsers: () => ({}),
  }),
  loaders(({ actions, values }) => ({
    users: [
      [] as User[],
      {
        loadUsers: async () => {
          console.log("loading users")
          return (await api.user.getAll())
        },
      },
    ],
  })),
  listeners(({ actions, values }) => ({
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      console.log("after mount user")
      actions.loadUsers()
    },
  })),
])
