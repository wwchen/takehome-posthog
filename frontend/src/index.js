import App from 'App'
import 'index.css'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from 'reportWebVitals'

posthog.init('phc_725k4zwsH7Fbjjx6dYjPSe7uFgmg1uCuth5UbSTycRL', { api_host: 'https://app.posthog.com' })

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
