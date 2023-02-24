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
  const [userProps, setUserProps] = useState({});
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
  }, []);
  
  useEffect(() => {
    client.get("/event-properties").then(response => {
      console.log("fetched event properties");
      setEventProperties(response.data);
    })
  }, []);

  function handleFunnelClick(nextPath) {
    client.post("/event-funnel/details", {path: nextPath}).then(response => {
      console.log(`fetched event funnels for '${nextPath}'`)
      const key = nextPath.join("|")
      setFunnelPath(nextPath);
      setFunnelEvents({...funnelEvents, [key]: response.data})
    })
  }

  function handleUserDetail(userId) {
    client.get(`user/${userId}/events`).then((response) => {
      setUserEvents({...userEvents, [userId]: response.data});
      setCurrUserId(userId);
    });
    client.get(`user/${userId}/event-properties`).then((response) => {
      setUserProps({...userProps, [userId]: response.data});
      setCurrUserId(userId);
    })
  }
  
  return (
    <div className="App">
      <h2>Funnel</h2>
      <Funnel funnelPath={funnelPath} funnelEvents={funnelEvents} handleFunnelClick={handleFunnelClick}></Funnel>
      <h2>User Detail Page</h2>
      <input onChange={e => handleUserDetail(e.target.value)} /> or <br />
      <select onChange={e => handleUserDetail(e.target.value)}>
        {userData.map((user) => <option value={user.id}>{user.email || user.id}</option>)}
      </select>
      <div>
        <h3>User Detail</h3>
        <User {...userData.filter((v) => v.id === currUserId)[0]} events={userEvents[currUserId]} props={userProps[currUserId]} />
      </div>
      <hr></hr>
      <h2>Event properties, distinct by user</h2>
      <textarea value={JSON.stringify(eventProperties, null, 4)} rows="30" cols="100"></textarea>

      {/* <PieChart /> */}
    </div>
  );
}

export default App;


