import { GraphQLClient } from 'graphql-request'

import { Path } from '@/constants/Path'

export const graphQLClient = new GraphQLClient(Path.APIGraphql, {
  headers: {
    'Content-Type': 'application/json',
  },
})
