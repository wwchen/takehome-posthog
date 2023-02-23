# PostHog interview test

Hey there 👋. We're super happy you've made it this far into the process, and very excited for you to tackle this final challenge.

The idea here is to end up with a functional, if simple, app. We've already set up a basic React frontend and a couple of backend servers to get you started. You don't _have_ to use any of this though, so feel free to use something else entirely.

You can use any languages/libraries/packages you want.

This test is to see if you can scrappily get an MVP up and running within a day. Don't worry too much about code quality, though any calculations over the data should be correct.

At the end of the day, please send us a few lines (over email or Slack) with
- how you approached this task and whether you'd do things differently now
- what you thought of this exercise
- how you would carry on building this if you had another 2 weeks

Package up your directory as a ZIP and post in the Slack channel.

Also, please keep this test to yourself and don't share it with anyone else.

Good luck!


## The challenge

You're an engineer at HedgeHogFlix, the leading movie streaming service for hedgehog related content. There's a dump of raw events, and you want to build a tool that allows anyone in the company to do analysis on that data. It's up to you to figure out what kind of analysis would be useful.


## The data

The data is stored inside of two JSON files in the `/data` folder. One of these, `/data/events.json`, holds every event that's happened. It's an array of objects in this format:

```json
[
    {"event": "user visited home page", "timestamp": "2020-03-20T01:31:12.467113+00:00", "distinct_id": "bbc72ed3-ede2-41d7-aa16-d441f5c19d8b", "properties": {"country": "UK"}},
    {"event": "user watched movie", "timestamp": "2020-03-20T01:31:16.597312+00:00", "distinct_id": "2085", "properties": {"country": "Canada"}}
]
```

- `event` is the type of action the user did. We have a few:
    - user visited home page
    - user visited sign up page
    - user created account
    - user entered credit card
    - user watched movie
- The `distinct_id` is the unique id for this user. If the user is anonymous (ie, they aren't logged in) this will be a UUID. If they are logged in, it will be an integer that corresponds with the account ID in the HedgeHogFlix backend.
- `timestamp` iso format timestamp of when the event occured
- `properties` is an object that can hold any kind key/value pairs. They might store the user's browser, country they're in, their chosen plan etc.

Then there is another file called `/data/users.json`. It's in this format:

```json
[
    {"user_id": "9eea99e5-39e1-482a-8ce9-8848f0bacc42", "distinct_ids": ["bbc72ed3-ede2-41d7-aa16-d441f5c19d8b", "2085"], "properties": {"email": "jane@gmail.com"}},
]
```

- `user_id` is a unique UUID the analytics backend assigns whenever it sees a new distinct_id that isn't already part of another user.
- `distinct_ids` is a list of distinct_ids belonging to this user. A user can have multiple distinct_ids. This happens when originally a user was anonymous (because they were browsing the home page for example) and then decided to sign up. At that point, instead of creating 2 users, HedgeHogFlix's analytics backend will combine the anonymous UUID and the integer from the backend into a single user.
- `properties` is again an object that can hold any kind of key/value pairs.

## Getting started

### Frontend

```bash
cd frontend
yarn install
yarn start
```

This will open your frontend at http://localhost:3000

### Python

```bash
cd backend/python
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
./start
```

Will run a server on http://localhost:5000.

Black is installed, so if you want you can run `black .` at the end to format your code if it is python.


enable all kinds of analytics

exploration
filters:
- logged in / anon users
- properties
- events
- time series graph


dashboard:
- event funnel per user
- overall funnel flow
- conversion rate (anon -> logged in time)


controller
- combine user and event properties


get user events

data validations
- if user id, then must have email property
- user distinct ids are unique and not nested


