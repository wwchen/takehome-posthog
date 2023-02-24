import React from 'react';
import axios from 'axios';
import User from './User';

export default function UserList({users, handleUserDetail}){
    return (
        <div>
        {users.map((user, i) =>
            <User key={i} {...user} handleUserDetail={handleUserDetail} />
        )}
        </div>
    )

}