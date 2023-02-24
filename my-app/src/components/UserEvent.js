import React from 'react';
import axios from 'axios';
import { User } from './User';

export default function UserEvent({events}){
    if (!events) return <></>
    return (
        <div>
        {events.map((event, i) =>
            <div key={i}>{event.event} ({event.timestamp})</div>
        )}
        </div>
    )

}