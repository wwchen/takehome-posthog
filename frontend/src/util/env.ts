const nodeEnv = process.env.NODE_ENV
export const isDevEnv = nodeEnv && nodeEnv !== 'production'

console.log(`NODE_ENV is ${nodeEnv}`)

export interface Config {
  baseUrl: string
}

export const config: Config = isDevEnv
  ? {
      baseUrl: 'http://localhost:8080',
    }
  : {
      baseUrl: 'https://wwchen-posthog-backend.herokuapp.com',
    }
