import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { axios } from '@/utils/axios'

const createReview = async (answerId: string, content: string) => {
  const query = gql`
    mutation ($input: CreateReviewInput!) {
      createReview(input: $input) {
        id
        content
      }
    }
  `
  const variables = {
    input: {
      answerId,
      content,
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

const getReviewByAnswerId = async (answerId: string) => {
  const query = gql`
    query ($answerId: ID!) {
      reviewByAnswerId(answerId: $answerId) {
        id
        comment
        user {
          id
        }
        answer {
          id
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

export const reviewService = {
  createReview,
  getReviewByAnswerId,
}
