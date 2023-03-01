import React from 'react'
import User from 'components/User'

export default function UserList({ users, handleUserDetail }) {
  return (
    <div>
      {users.map((user, i) => (
        <User key={i} {...user} handleUserDetail={handleUserDetail} />
      ))}
    </div>
  )
}
