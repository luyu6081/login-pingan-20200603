import ApolloClient from 'apollo-boost'

import runtimeArgs from '@/runtime-args'
import schema from './schema'

const client = new ApolloClient({
  uri: runtimeArgs.EJ_AUTH_ENDPOINT_HTTP,
  credentials: 'include',
  ...schema,
})

export default client
