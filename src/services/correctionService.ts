import { gql } from 'graphql-request'

import { AmplifyUser } from '@/types/model/amplifyUser'
import { CompletedAnswerSentence } from '@/types/model/answer'
import { getGraphQLClient } from '@/utils/graphqlClient'

const createCorrection = async (
  answerId: string,
  num: number,
  sentence: string,
  user?: AmplifyUser,
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

  return await getGraphQLClient(user).request<{
    createCorrection: CompletedAnswerSentence
  }>(query, variables)
}

const getCorrectionByAnswerId = async (
  answerId: string,
  user?: AmplifyUser,
) => {
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

  return await getGraphQLClient(user).request<{
    correctionByAnswerId: {
      correctedAnswerSentences: CompletedAnswerSentence[]
    }
  }>(query, variables)
}

export const correctionService = {
  createCorrection,
  getCorrectionByAnswerId,
}
