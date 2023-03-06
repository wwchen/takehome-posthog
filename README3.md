# Screenshots
## V0
[View V0 live](https://wwchen-posthog-submission.herokuapp.com/)
<img width="2056" alt="image" src="https://user-images.githubusercontent.com/344958/222995325-28c9fb7e-3ddd-4f32-9584-f680a4e8cec1.png">

## V1
[View V1 live](https://wwchen-posthog-frontend.herokuapp.com/)
<img width="2056" alt="image" src="https://user-images.githubusercontent.com/344958/222995285-9706d4f8-8c10-41de-a157-69bc51616b65.png">

# Changes & Upgrades from V0
## Event funnel flow
<img width="358" alt="image" src="https://user-images.githubusercontent.com/344958/222996241-88c1c35b-d63f-429b-a1ae-b463cb261269.png">

### Product updates
- (fix) More intuitive funnel flow: user converstion count between steps are now shown in between event names
- (feat) Dropdown menu is clearable or selectable
	- when selected, the user count will be hidden from view for a cleaner UI
	- when cleared (by hovering over), succeeding steps will be cleared out
### Technical details
- React component: [FunnelExploration.tsx](https://github.com/wwchen/takehome-posthog/blob/main/frontend/src/components/FunnelExploration.tsx)
- kea logic: [eventFunnelLogic.ts](https://github.com/wwchen/takehome-posthog/blob/main/frontend/src/scenes/eventFunnelLogic.ts)
- `POST /event-funnel/next-events` ([code](https://github.com/wwchen/takehome-posthog/blob/main/backend-scala/src/main/scala/wwchen/posthog/hedgehogflix/services/BaseService.scala#L25), [implementation](https://github.com/wwchen/takehome-posthog/blob/main/backend-scala/src/main/scala/wwchen/posthog/hedgehogflix/services/FlixAnalytics.scala#L135))
- Every chosen path is a backend call to get matching user ids
	- (req) path <> (resp) user ids can be cached, but for a cleaner kea logic, I did not maintain a state variable for caching

## Users table
<img width="1033" alt="image" src="https://user-images.githubusercontent.com/344958/222996269-512b7fc3-537b-486a-8c30-c2132ab9ee9a.png">

### Product updates
- User table is filterable and sortable, via
	- tabs above the table
	- clicking on column header
- User table has a paginated view
- When user walks through the event funnel, the table will switch over to "Show users in funnel"

### Technical details
- All users are fetched in one `GET /users` ([implementation](https://github.com/wwchen/takehome-posthog/blob/main/backend-scala/src/main/scala/wwchen/posthog/hedgehogflix/services/FlixAnalytics.scala#L81))
	- (tech debt): pagination
- Property filter key/value are fetched via `GET /event-properties` ([implementation](https://github.com/wwchen/takehome-posthog/blob/main/backend-scala/src/main/scala/wwchen/posthog/hedgehogflix/services/FlixAnalytics.scala#L99))
- User event timeline is lazily fetched, when user row is expanded, via `GET user/{userId}/events` ([implementation](https://github.com/wwchen/takehome-posthog/blob/main/backend-scala/src/main/scala/wwchen/posthog/hedgehogflix/services/FlixAnalytics.scala#L96)]


## Event stats summary table
<img width="684" alt="image" src="https://user-images.githubusercontent.com/344958/222996293-59d5ac86-6d5e-4fd4-a52d-42563e94651c.png">

### Product updates
- More intuitive UI that displays:
	- Aggregate stats
	- Context of when event is fired
		- (feat suggestion): show all possible preceeding and succeeding events in a dropdown
	- All captured event properties
- When user walks through the event funnel, the relevant event stat will expand open
### Technical details
- All stats are fetched in one `GET /event/stats`


## Event funnel flow
<img width="988" alt="image" src="https://user-images.githubusercontent.com/344958/222996350-ae93f0a5-b3cc-4f0a-b6a0-d05374567699.png">

### Product updates
- plug-and-play react component to generate a 'sankey' diagram
	- although a bit unintuitive, this was a relatively easy lift, and demonstrates possible UX
- doesn't render circular paths

### technical details
- necessary data is fetched via `GET event-funnel/edges`
- component used is `@ant-design/plots`


# Known issues
- although functional, mobile viewport is not optimized
- user count is off by one
- error states are (all) not gracefully handled: if backened is unavailable, UI is broken
- (tech debt) test coverage on backend and frontend code
- some backend calls are fired more than once: need to investigate into kea listener breakpoints


# lessons learned
## UI
- use of antd components
	- attempted to use lemon-ui, but css wasn't applying

## React
- "key" is a reserved keyword in JSX.Element - don't pass a "key" props to your component (I renamed "stepKey")

## kea
- use of kea and kea loaders plugin
- use of connect, reducer, actions, listener
- took some backstepping and debugging, and turns out ordering matters in kea impl: e.g. listener > events
- kea loader plugin does not work correctly when one action triggers more than one reducer
- kea codegen sometimes put in abs path in code?

## CI/CD
- use of heroku
	- was hoping for a quick plug-and-play, but ran into some headaches with subdir projects, paths, ahd buildpack with create-react-app apps
- added posthog client to the site, so I :see: you



# Useful links
- website: [https://wwchen-posthog-frontend.herokuapp.com/](https://wwchen-posthog-frontend.herokuapp.com/)
- backend: [https://wwchen-posthog-backend.herokuapp.com/](https://wwchen-posthog-backend.herokuapp.com/)
- code repo: [https://github.com/wwchen/takehome-posthog](https://github.com/wwchen/takehome-posthog)
- original submission: [https://wwchen-posthog-submission.herokuapp.com/](https://wwchen-posthog-submission.herokuapp.com/)


