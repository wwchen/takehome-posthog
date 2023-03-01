import React from 'react'
import UserEvent from 'components/UserEvent'
import UserProperties from 'components/UserProperties'

export default function User({ id, email, lastSeen, isAnon, events, props }) {
  return (
    <table>
      <tbody>
        <tr>
          <td>id</td>
          <td>{id}</td>
        </tr>
        {isAnon || (
          <tr>
            <td>email</td>
            <td>{email}</td>
          </tr>
        )}
        <tr>
          <td>last seen</td>
          <td>{lastSeen}</td>
        </tr>
        <tr>
          <td>user events</td>
          <td>
            <UserEvent events={events}></UserEvent>
          </td>
        </tr>
        <tr>
          <td>properties</td>
          <td>
            <UserProperties props={props}></UserProperties>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
