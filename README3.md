## resources
[https://wwchen-posthog-frontend.herokuapp.com/](https://wwchen-posthog-frontend.herokuapp.com/)
[https://wwchen-posthog-backend.herokuapp.com/](https://wwchen-posthog-backend.herokuapp.com/)
[https://github.com/wwchen/takehome-posthog](https://github.com/wwchen/takehome-posthog)

## features
### event walkthrough
#### product updates
- more intuitive funnel flow: user converstion count between steps are now shown in between event names
- dropdown menu is clearable or selectable
	- when selected, the user count will be hidden from view for a cleaner UI
	- when cleared (by hovering over), succeeding steps will be cleared out
#### technical details
- every chosen path is a backend call to get matching user ids
	- (req) path <> (resp) user ids can be cached, but for a cleaner kea logic, I did not maintain a state variable for caching

### users table
#### product updates
- user table is filterable and sortable, via
	- tabs above the table
	- clicking on column header
- user table has a paginated view
- when user walks through the event funnel, the table will switch over to "Show users in funnel"
#### technical details
- all users are fetched in one `GET /users`
	- (tech debt): pagination
- property filter key/value are fetched via `GET /event-properties`
- user event timeline is lazily fetched, when user row is expanded, via `GET user/{userId}/events`

### event stats summary table
#### product updates
- more intuitive UI that displays:
	- aggregate stats
	- context of when event is fired
		- (feat suggestion): show all possible preceeding and succeeding events in a dropdown
	- all captured event properties
- when user walks through the event funnel, the relevant event stat will expand open
#### technical details
- all stats are fetched in one `GET /event/stats`


### event funnel flow
#### product updates
- plug-and-play react component to generate a 'sankey' diagram
	- although a bit unintuitive, this was a relatively easy lift, and demonstrates possible UX
- doesn't render circular paths

#### technical details
- necessary data is fetched via `GET event-funnel/edges`
- component used is `@ant-design/plots`


### known issues
- although functional, mobile viewport is not optimized
- user count is off by one
- error states are (all) not gracefully handled: if backened is unavailable, UI is broken
- (tech debt) test coverage on backend and frontend code
- some backend calls are fired more than once: need to investigate into kea listener breakpoints


### technical details


## lessons learned
### kea
- use of kea and kea loaders plugin
- use of connect, reducer, actions, listener

### UI
- use of antd components
	- attempted to use lemon-ui, but css wasn't applying

### react
- "key" is a reserved keyword in JSX.Element
- ordering matters in kea impl: listener > events
- kea loader plugin does not work correctly when one action triggers more than one reducer
- kea codegen sometimes put in abs path in code?

### CI/CD
- use of heroku
	- was hoping for a quick plug-and-play, but ran into some headaches with subdir projects, paths, ahd buildpack with create-react-app apps
- added posthog client to the site, so I :see: you

