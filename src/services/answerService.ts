import { gql } from 'graphql-request'

import { AnswerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { axios } from '@/utils/axios'

const createAnswer = async (
  problemId: string,
  answer: string,
  answerSpentTime: number,
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
      status,
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

export const answerService = {
  createAnswer,
}
