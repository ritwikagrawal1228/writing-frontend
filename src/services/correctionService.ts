import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { axios } from '@/utils/axios'

const createCorrection = async (
  answerId: string,
  num: number,
  sentence: string,
) => {
  const query = gql`
    mutation ($input: CreateCorrectionInput!) {
      createCorrection(input: $input) {
        id
      }
    }
  `
  const variables = {
    input: {
      answerId,
      correctedAnswerSentence: {
        num,
        sentence,
      },
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

const getCorrectionByAnswerId = async (answerId: string) => {
  const query = gql`
    query ($answerId: ID!) {
      correctionByAnswerId(answerId: $answerId) {
        id
        correctedAnswerSentences {
          num
          sentence
        }
      }
    }
  `

  const variables = {
    answerId,
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

export const correctionService = {
  createCorrection,
  getCorrectionByAnswerId,
}
