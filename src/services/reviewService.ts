import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { Review } from '@/types/model/review'
import { axios } from '@/utils/axios'

const createReview = async (answerId: string, content: string) => {
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

const getAiReviewByAnswerId = async (answerId: string, locale: string) => {
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
      locale,
    },
  }

  return await axios.post<{ createAiReview: Review }>(Path.APIGraphql, {
    query,
    variables,
  })
}

const updateReview = async (reviewId: string, content: string) => {
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

  return await axios.post<{ updateReview: Review }>(Path.APIGraphql, {
    query,
    variables,
  })
}

const deleteReview = async (reviewId: string) => {
  const query = gql`
    mutation ($id: ID!) {
      deleteReview(id: $id)
    }
  `

  const variables = {
    id: reviewId,
  }

  return await axios.post<{ deleteReview: Review }>(Path.APIGraphql, {
    query,
    variables,
  })
}

export const reviewService = {
  createReview,
  getReviewsByAnswerId,
  getAiReviewByAnswerId,
  updateReview,
  deleteReview,
}
