import React from 'react';
import axios from 'axios';
import { User } from './User';

export default function UserProperties({props}){
    if (!props) return <></>
    return (
        <div>
        {Object.keys(props).map((prop, i) =>
            <div key={i}>{props[prop]} - {prop}</div>
        )}
        </div>
    )

}