import 'App.css'

import 'antd/dist/reset.css'
import { FunnelExploration } from 'components/FunnelExploration'
import { FunnelFlow } from 'components/FunnelFlow'
import { UserTable } from 'components/UserTable'
import { Row, Col, Alert } from 'antd'
import { EventDetails } from 'components/EventDetails'
import { useState, useEffect } from 'react'

function App() {
  const [width, setWidth] = useState(window.innerWidth)

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const minWidth = 1700
  const isMobile = width <= minWidth

  return (
    <>
      <div className="App">
        {isMobile && (
          <Alert
            type="warning"
            message={`For maximum experience, please view the site on a desktop fullscreen browser (wider than ${minWidth})`}
          />
        )}
        <Row gutter={[10, 10]}>
          <Col flex="1">
            <FunnelExploration />
          </Col>
          <Col flex="3">
            <UserTable />
          </Col>
          <Col flex="2">
            <EventDetails />
          </Col>
        </Row>
        <Row>
          <Col flex="1">
            <FunnelFlow />
          </Col>
        </Row>

        {/* <EventDetails /> */}
        {/* <Github /> */}
        {/* <Funnel funnelPath={funnelPath} funnelEvents={funnelEvents} handleFunnelClick={handleFunnelClick}></Funnel> */}

        {/* <h2>User Detail Page</h2>
      <input onChange={(e) => handleUserDetail(e.target.value)} /> or <br />
      <select onChange={(e) => handleUserDetail(e.target.value)}>
        {userData.map((user) => (
          <option value={user.id}>{user.email || user.id}</option>
        ))}
      </select>
      <div>
        <h3>User Detail</h3>
        <User
          {...userData.filter((v) => v.id === currUserId)[0]}
          events={userEvents[currUserId]}
          props={userProps[currUserId]}
        />
      </div>
      <hr></hr>
      <h2>Event properties, distinct by user</h2>
      <textarea value={JSON.stringify(eventProperties, null, 4)} readOnly rows="30" cols="100"></textarea> */}
      </div>
    </>
  )
}

export default App
