import { GraphQLClient, gql } from 'graphql-request'

import { CreateProblemForm } from '@/types/form/CreateProblemForm'
import { Problem } from '@/types/model/problem'
import { User } from '@/types/model/user'
import { axios } from '@/utils/axios'
import { getGraphQLClient } from '@/utils/graphqlClient'
import { Path } from '@/constants/Path'
import { AmplifyUser } from '@/types/model/amplifyUser'

const getProblemsByUserId = async (user?: AmplifyUser) => {
  const query = gql`
    query ($userId: String!) {
      problemsByUserId(userId: $userId) {
        id
        title
        question
        questionImageKey
        taskType
        createdAt
      }
    }
  `

  const variables = {
    userId: user?.attributes.sub,
  }

  return await getGraphQLClient(user).request<{ problemsByUserId: Problem[] }>(
    query,
    variables,
  )
}

const getProblemById = async (id: string, user?: AmplifyUser) => {
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

  return await getGraphQLClient(user)
    .request<{ problem: Problem }>(query, variables)
    .then((res) => res)
}

const deleteProblemById = async (id: string, user?: AmplifyUser) => {
  const query = gql`
    mutation ($id: ID!) {
      deleteProblem(id: $id)
    }
  `
  const variables = {
    id,
  }

  return await getGraphQLClient(user)
    .request<{ deleteProblem: boolean }>(query, variables)
    .then((res) => res)
}

const createProblem = async (
  data: CreateProblemForm,
  key: string,
  user?: AmplifyUser,
) => {
  const uploadQuery = gql`
    mutation ($input: CreateProblemInput!) {
      createProblem(input: $input) {
        id
      }
    }
  `
  const variables = {
    input: {
      title: data.title,
      taskType: data.taskType,
      question: data.question,
      questionImageKey: key,
    },
  }

  return await getGraphQLClient(user).request<{ createProblem: Problem }>(
    uploadQuery,
    variables,
  )
}

const updateProblem = async (
  problemId: string,
  data: CreateProblemForm,
  key: string,
  user?: AmplifyUser,
) => {
  const uploadQuery = gql`
    mutation ($input: UpdateProblemInput!) {
      updateProblem(input: $input) {
        id
      }
    }
  `
  const variables = {
    input: {
      problemId,
      title: data.title,
      taskType: data.taskType,
      question: data.question,
      questionImageKey: key,
    },
  }

  return await getGraphQLClient(user).request<{ updateProblem: Problem }>(
    uploadQuery,
    variables,
  )
}

export const problemService = {
  getProblemsByUserId,
  getProblemById,
  deleteProblemById,
  createProblem,
  updateProblem,
}
