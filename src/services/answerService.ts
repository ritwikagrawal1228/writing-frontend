import { gql } from 'graphql-request'

import { AnsweringForm } from '@/types/form/AnsweringForm'
import { AmplifyUser } from '@/types/model/amplifyUser'
import { Answer } from '@/types/model/answer'
import { getGraphQLClient } from '@/utils/graphqlClient'

const getAnswersByProblemId = async (problemId: string, user?: AmplifyUser) => {
  const query = gql`
    query ($problemId: String!) {
      answersByProblemId(problemId: $problemId) {
        id
        problemId
        answer
        answerSpentTime
        status
        createdAt
        updatedAt
      }
    }
  `

  const variables = {
    problemId,
  }

  return await getGraphQLClient(user).request<{ answersByProblemId: Answer[] }>(
    query,
    variables,
  )
}

const createAnswer = async (
  problemId: string,
  answerForm: AnsweringForm,
  user?: AmplifyUser,
) => {
  const query = gql`
    mutation ($input: CreateAnswerInput!) {
      createAnswer(input: $input) {
        id
      }
    }
  `
  const variables = {
    input: {
      problemId,
      answer: answerForm.answer,
      answerSpentTime: answerForm.countDownSec,
      time: answerForm.time,
      status: answerForm.status,
    },
  }

  return await getGraphQLClient(user).request<{ createAnswer: Answer }>(
    query,
    variables,
  )
}

const updateAnswer = async (
  answerId: string,
  problemId: string,
  answerForm: AnsweringForm,
  user?: AmplifyUser,
) => {
  const query = gql`
    mutation ($input: UpdateAnswerInput!) {
      updateAnswer(input: $input) {
        id
      }
    }
  `
  const variables = {
    input: {
      answerId,
      problemId,
      answer: answerForm.answer,
      answerSpentTime: answerForm.countDownSec,
      time: answerForm.time,
      status: answerForm.status,
    },
  }

  return await getGraphQLClient(user).request<{ updateAnswer: Answer }>(
    query,
    variables,
  )
}

const getAnswerById = async (id: string, user: AmplifyUser) => {
  const query = gql`
    query ($id: String!) {
      answer(answerId: $id) {
        id
        answer
        answerSpentTime
        time
        status
        createdAt
        updatedAt
        completedAnswerSentences {
          num
          sentence
        }
        problem {
          id
          title
          taskType
          question
          questionImageKey
          createdAt
        }
      }
    }
  `
  const variables = {
    id,
  }

  return await getGraphQLClient(user)
    .request<{ answer: Answer }>(query, variables)
    .then((res) => res)
}

export const answerService = {
  createAnswer,
  updateAnswer,
  getAnswerById,
  getAnswersByProblemId,
}
