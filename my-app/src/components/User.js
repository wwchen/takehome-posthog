import React from 'react';
import axios from 'axios';
import UserEvent from './UserEvent';

export default function User({ id, email, lastSeen, isAnon, events }) {
    return (
      <table>
        <tbody>
            <tr><td>id</td><td>{id}</td></tr>
            {isAnon || <tr><td>email</td><td>{email}</td></tr>}
            <tr><td>last seen</td><td>{lastSeen}</td></tr>
            <tr><td>user events</td><td><UserEvent events={events}></UserEvent></td></tr>
        </tbody>
      </table>
    );
  }