
## debrief
### how you approached this task and whether you'd do things differently now
I had a few thoughts of approaching this problem:
1. (quick data exploration) - get a juypter notebook up, and pivot the data (can even use sql)
2. (dashboarding) - e.g looker, mixpanel; get some interesting data insights from pivoting
3. (data streaming to data warehouse to query/etl interface) - out of scope for this task

Given this is more data wrangling type problem, I thought Scala would be a good language to utilize for backend,
given its easy nature to compose functions and chain results. I also realize that I could do it all in React,
but I'm _really_ not familiar with the language, tooling, and framework, so I'd be more efficient working in backend.

### what I did like
I'm somewhat surprised that with my myriad of array, maps transformations of group by, sort, distinct, etc, that
the calculations worked out bug-free. The tradeoff for this conciseness though, is readability. I would clean up so 
it's easier to follow.

#### what I'd do differently
1. time management: unfortunately, I lost a lot of time getting my environemnt and skeleton code up and running;
anxiety crept up and that got me really honed in ruidmentary and uninsightful data transformations, which leads me to next
2. ideate + sanity check with others first: it's too easy to get absorbed into the technialities, and I didn't leverage my resources well
3. improve on frontend; utilize expertise of others: googling on syntax errors and weird behaviors (like `this` scoping, 
function vs class Component, do I need to put code in `componentDidMount`, but theoretically `useState` should re-render, but
it's still not re-rendering; oh - `<textarea>{foo}</textarea>` isn't going to re-render, it gotta be `<textarea value={foo} />`)
I definitely should've liked to use the Slack channel more, but by then it was after-hours

### what you thought of this exercise
Overall, well - I had fun. Definitely have areas to strengthen.

### how you would carry on building this if you had another 2 weeks
1. UI/UX - I really struggled through React; I want to have pop-ups and pages, but instead, all the information are on
one page. Another avenue to explore is finding suitable js-viz plugins to use. There are probably easy to install, plug-and-play
plugins that would add bar/graph/pie charts, querying support, etc.
2. stronger product use case - the ultimate product user story I'd like to support is data exploration that leads to new insights.
what I have envisioned for that is: 
    1. high level exploration of event funnel flow
    2. at a glance see what the top of funnel events are, major paths, drop off paths
    3. double click into a specific flow, by picking an user that matches this even flow
    4. now we're at granular level of studying user behavior and from their event log, discover insight where one might be stuck, abandoned, etc

Another user story to add, is based around time series and discoverying hotspots
This would be achieved by adding features like filter by property, anon/auth'd user, biz tags; viz on timeseries, segments, 

3. more flexible querying - allow frontend to construct data queries, instead of single-purpose backend endpoints to
retrieve one dimension of the data. this will probably unlock faster iterations

Explore dimensions by event properties: browser and country values, as examples, are good ways to cohort users, if the biz need is to find
groups to do a/b experiments, as an example.


## Getting Started
### Requirements
- backend (requires sbt (brew), java, scala (v2.13)): `cd backend-scala; sbt run`
- frontend (requires npm): `cd my-app; npm install && npm start`

### Local environment setup
For macOS users, if you do not already have Java, scala, sbt, the recommended way to get set up is
```
brew install coursier/formulas/coursier && cs setup
```
For other environments, [follow scala's official guide](https://docs.scala-lang.org/getting-started/index.html)

## Usage
`sbt run` - compiles and starts the http server `Main.scala`
`sbt test` - compiles and executes unit tests

## endpoints
```
    GET "user" / userId / "events"
    GET "user" / userId / "event-properties"
    GET "users"
    GET "event-properties"
    POST "event-funnel" / "count"
    POST "event-funnel" / "details"    
```

## walkthrough
1. product, get feedback
  1. flow's caveat: doens't allow for circular flows. will need to rework to enable backstepping
2. implementation commentary
3. technical q's
  1. react pages/navigation - how to "hide" components
  2. any good way to "walk" down a json object?
  3. how to avoid function calls on null/undefined objects
  4. how to pass type hinting
  5. smart ide to import components
  6. 