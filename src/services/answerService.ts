import { gql } from 'graphql-request'

import { AnswerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { Answer } from '@/types/model/answer'
import { axios } from '@/utils/axios'
import { getGraphQLClient } from '@/utils/graphqlClient'

const createAnswer = async (
  problemId: string,
  answer: string,
  answerSpentTime: number,
  time: number,
  status: AnswerStatus,
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
      answer,
      answerSpentTime,
      time,
      status,
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

const updateAnswer = async (
  answerId: string,
  problemId: string,
  answer: string,
  answerSpentTime: number,
  time: number,
  status: AnswerStatus,
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
      answer,
      answerSpentTime,
      time,
      status,
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

const getAnswerById = async (id: string, user: any) => {
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

  const client = getGraphQLClient(user)

  return await client
    .request<{ answer: Answer }>(query, variables)
    .then((res) => res)
}

export const answerService = {
  createAnswer,
  updateAnswer,
  getAnswerById,
}
