import logo from './logo.svg';
import './App.css';
import './components/UserList';
import axios from "axios";
import { useEffect, useState } from 'react';
import User from './components/User';
import UserList from './components/UserList';
import Funnel from './components/Funnel';
import UserEvent from './components/UserEvent';

import React from "react";
import { render } from "react-dom";
import { VictoryPie } from "victory";


function App() {
  const [funnelPath, setFunnelPath] = useState(["x"]);
  const [funnelEvents, setFunnelEvents] = useState({});

  const [userData, setUserData] = useState([]);
  const [userEvents, setUserEvents] = useState({});
  const [currUserId, setCurrUserId] = useState("");

  const [eventProperties, setEventProperties] = useState({});

  const client = axios.create({
    baseURL: "http://localhost:8080",
    headers: {"Access-Control-Allow-Origin": "*"}
  });
  const PieChart = () => {
    return <VictoryPie />;
  };

  useEffect(() => {
    client.get("/users").then((response) => {
      console.log("fetched users")
      setUserData(response.data);
    })  
  
    handleFunnelClick(funnelPath);
  
    client.get("/event-properties").then(response => {
      console.log("fetched event properties");
      setEventProperties(response.data);
    })
  }, []);

  function handleFunnelClick(nextPath) {
    client.post("/event-funnel", {path: funnelPath}).then(response => {
      console.log(`fetched event funnels for '${funnelPath}'`)
      const key = funnelPath.join("|")
      setFunnelPath(funnelPath);
      setFunnelEvents({...funnelEvents, [key]: response.data})
    })
  }

  function handleUserDetail(userId) {
    client.get(`user/${userId}/events`).then((response) => {
      setUserEvents({...userEvents, [userId]: response.data});
      setCurrUserId(userId);
    })
  }
  
  return (
    <div className="App">
      <h2>Funnel</h2>
      <Funnel funnelPath={funnelPath} funnelEvents={funnelEvents} handleFunnelClick={handleFunnelClick}></Funnel>
      <hr />
      <h2>User Detail Page</h2>
      <select onChange={e => handleUserDetail(e.target.value)}>
        {userData.map((user) => <option value={user.id}>{user.email || user.id}</option>)}
      </select>
      <div>
        <h3>User Detail</h3>
        <User {...userData.filter((v) => v.id === currUserId)[0]} events={userEvents[currUserId]} />
      </div>
      <h2>Events</h2>
      <textarea>{JSON.stringify(eventProperties)}</textarea>

      {/* <PieChart /> */}
      {/* <UserList users={userData} /> */}
    </div>
  );
}

export default App;


