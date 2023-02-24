import React from 'react';
import axios from 'axios';
import UserEvent from './UserEvent';
import UserProperties from './UserProperties';

export default function User({ id, email, lastSeen, isAnon, events, props }) {
    return (
      <table>
        <tbody>
            <tr><td>id</td><td>{id}</td></tr>
            {isAnon || <tr><td>email</td><td>{email}</td></tr>}
            <tr><td>last seen</td><td>{lastSeen}</td></tr>
            <tr><td>user events</td><td><UserEvent events={events}></UserEvent></td></tr>
            <tr><td>properties</td><td><UserProperties props={props}></UserProperties></td></tr>
        </tbody>
      </table>
    );
  }