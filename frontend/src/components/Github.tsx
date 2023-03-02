import React from 'react'
import { kea, useActions, useValues, actions, events, reducers, selectors, listeners, path } from 'kea'

import type { logicType } from './GithubType'

const API_URL = 'https://api.github.com'

const logic = kea<logicType>([
  path(['src', 'components', 'Github']),
  actions({
    setUsername: (username: string) => ({ username }),
    setRepositories: (repositories: string[]) => ({ repositories }),
    setFetchError: (error: any) => ({ error }),
  }),
  reducers({
    username: [
      'keajs',
      {
        setUsername: (_, { username }) => username,
      },
    ],
    repositories: [
      [],
      {
        setUsername: () => [],
        setRepositories: (_, { repositories }) => repositories,
      },
    ],
    isLoading: [
      false,
      {
        setUsername: () => true,
        setRepositories: () => false,
        setFetchError: () => false,
      },
    ],
    error: [
      null,
      {
        setUsername: () => null,
        setFetchError: (_, { error }) => error,
      },
    ],
  }),
  selectors({
    sortedRepositories: [
      (selectors) => [selectors.repositories],
      (repositories: any) => {
        return [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count)
      },
    ],
  }),
  listeners(({ actions }) => ({
    setUsername: async ({ username }, breakpoint) => {
      await breakpoint(300)
      const url = `${API_URL}/users/${username}/repos?per_page=250`

      // 👈 handle network errors
      let response
      try {
        response = await window.fetch(url)
      } catch (error: any) {
        actions.setFetchError(error.message)
        return // 👈 nothing to do after, so return
      }

      // break if action was dispatched again while we were fetching
      breakpoint()

      const json = await response.json()

      if (response.status === 200) {
        actions.setRepositories(json)
      } else {
        actions.setFetchError(json.message)
      }
    },
  })),
  events(({ props, values, actions }) => ({
    afterMount: () => {
      actions.setUsername(values.username)
    },
  })),
])

export function Github(): JSX.Element {
  const { username, isLoading, sortedRepositories, error } = useValues(logic)
  const { setUsername } = useActions(logic)

  return (
    <div className="example-github-scene">
      <div style={{ marginBottom: 20 }}>
        <h1>Search for a github user</h1>
        <input value={username} type="text" onChange={(e) => setUsername(e.target.value)} />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : sortedRepositories.length > 0 ? (
        <div>
          Found {sortedRepositories.length} repositories for user {username}!
          {sortedRepositories.map((repo: any) => (
            <div key={repo.id}>
              <a href={repo.html_url} target="_blank">
                {repo.full_name}
              </a>
              {' - '}
              {repo.stargazers_count} stars, {repo.forks} forks.
            </div>
          ))}
        </div>
      ) : (
        <div>{error ? `Error: ${error}` : 'No repositories found'}</div>
      )}
    </div>
  )
}
