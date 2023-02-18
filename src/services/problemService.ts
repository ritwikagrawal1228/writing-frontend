import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { Problem } from '@/types/model/problem'
import { axios } from '@/utils/axios'
import { getGraphQLClient } from '@/utils/graphqlClient'

const getProblemsByUserId = async (user: any) => {
  const query = gql`query {
    problemsByUserId(userId: "${user.attributes.sub}") {
      id
      title
      question
      questionImageKey
      taskType
      createdAt
    }
  }`

  const client = getGraphQLClient(user)

  return await client
    .request<{ problemsByUserId: Problem[] }>(query, {})
    .then((res) => res)
}

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

const deleteProblemById = async (id: string, user: any): Promise<boolean> => {
  const query = gql`
    mutation ($id: ID!) {
      deleteProblem(id: $id)
    }
  `
  const variables = {
    id,
  }

  return axios.post(Path.APIGraphql, { query, variables })
}

export const problemService = {
  getProblemsByUserId,
  getProblemById,
  deleteProblemById,
}
