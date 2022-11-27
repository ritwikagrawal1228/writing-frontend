import { gql } from 'graphql-request'

import { Problem } from '@/types/model/problem'
import { getGraphQLClient } from '@/utils/graphqlClient'

const getProblemById = async (id: string, user: any) => {
  const query = gql`
    query ($id: String!) {
      problem(problemId: $id) {
        id
        title
        taskType
        question
        questionImageKey
        createdAt
      }
    }
  `
  const variables = {
    id,
  }

  const client = getGraphQLClient(user)

  return await client
    .request<{ problem: Problem }>(query, variables)
    .then((res) => res)
}

export const postService = {
  getProblemById,
}
