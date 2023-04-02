import { gql } from 'graphql-request'

import { AmplifyUser } from '@/types/model/amplifyUser'
import { Review } from '@/types/model/review'
import { getGraphQLClient } from '@/utils/graphqlClient'

const createReview = async (
  answerId: string,
  content: string,
  user?: AmplifyUser,
) => {
  const query = gql`
    mutation ($input: CreateReviewInput!) {
      createReview(input: $input) {
        id
        userId
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

  return await getGraphQLClient(user).request<{ createReview: Review }>(
    query,
    variables,
  )
}

const getReviewsByAnswerId = async (answerId: string, user?: AmplifyUser) => {
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

  return await getGraphQLClient(user).request<{ reviewsByAnswerId: Review[] }>(
    query,
    variables,
  )
}

const getAiReviewByAnswerId = async (
  answerId: string,
  locale: string,
  user?: AmplifyUser,
) => {
  const query = gql`
    mutation ($input: CreateAiReviewInput!) {
      createAiReview(input: $input) {
        id
        content
        userId
      }
    }
  `

  const variables = {
    input: {
      answerId,
      locale,
    },
  }

  return await getGraphQLClient(user).request<{ createAiReview: Review }>(
    query,
    variables,
  )
}

const updateReview = async (
  reviewId: string,
  content: string,
  user?: AmplifyUser,
) => {
  const query = gql`
    mutation ($input: UpdateReviewInput!) {
      updateReview(input: $input) {
        id
        content
      }
    }
  `

  const variables = {
    input: {
      reviewId,
      content,
    },
  }

  return await getGraphQLClient(user).request<{ updateReview: Review }>(
    query,
    variables,
  )
}

const deleteReview = async (reviewId: string, user?: AmplifyUser) => {
  const query = gql`
    mutation ($id: ID!) {
      deleteReview(id: $id)
    }
  `

  const variables = {
    id: reviewId,
  }

  return await getGraphQLClient(user).request<{ deleteReview: Review }>(
    query,
    variables,
  )
}

export const reviewService = {
  createReview,
  getReviewsByAnswerId,
  getAiReviewByAnswerId,
  updateReview,
  deleteReview,
}
