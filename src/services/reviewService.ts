import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { Review } from '@/types/model/review'
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

  return await axios.post<{ createReview: Review }>(Path.APIGraphql, {
    query,
    variables,
  })
}

const getReviewsByAnswerId = async (answerId: string) => {
  const query = gql`
    query ($answerId: String!) {
      reviewsByAnswerId(answerId: $answerId) {
        id
        content
        userId
      }
    }
  `

  const variables = {
    answerId,
  }

  return await axios.post<{ reviewsByAnswerId: Review[] }>(Path.APIGraphql, {
    query,
    variables,
  })
}

const getAiReviewByAnswerId = async (answerId: string) => {
  const query = gql`
    mutation ($input: CreateAiReviewInput!) {
      createAiReview(input: $input) {
        id
        content
      }
    }
  `

  const variables = {
    input: {
      answerId,
    },
  }

  return await axios.post<{ createAiReview: Review }>(Path.APIGraphql, {
    query,
    variables,
  })
}

export const reviewService = {
  createReview,
  getReviewsByAnswerId,
  getAiReviewByAnswerId,
}
