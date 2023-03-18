import axios from 'axios'
import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { SquareCard } from '@/types/model/squareCard'
import { AmplifyUser } from '@/types/model/amplifyUser'
import { getGraphQLClient } from '@/utils/graphqlClient'

const getSquareCard = async (user?: AmplifyUser) => {
  const query = gql`
    query () {
      getSquareCard {
        cardBrand
        last4
        expMonth
        expYear
      }
    }
  `

  return await getGraphQLClient(user).request<{ getSquareCard: SquareCard }>(
    query,
    {},
  )
}

const subscribePaidPlan = async (token: string, user?: AmplifyUser) => {
  const query = gql`
    mutation ($input: SubscribePaidPlanInput!) {
      subscribePaidPlan(input: $input)
    }
  `

  const variables = {
    input: {
      token,
    },
  }

  return await getGraphQLClient(user).request<{ subscribePaidPlan: boolean }>(
    query,
    variables,
  )
}

const updateSquareCard = async (token: string, user?: AmplifyUser) => {
  const query = gql`
    mutation ($input: UpdateSquareCardInput!) {
      updateSquareCard(input: $input) {
        cardBrand
        last4
        expMonth
        expYear
      }
    }
  `
  const variables = {
    input: {
      token,
    },
  }

  return await getGraphQLClient(user).request<{ updateSquareCard: SquareCard }>(
    query,
    variables,
  )
}

const cancelSubscription = async (user?: AmplifyUser) => {
  const query = gql`
    mutation {
      cancelCurrentSubscription
    }
  `

  return await getGraphQLClient(user).request<{
    cancelCurrentSubscription: string
  }>(query, {})
}

export const squareService = {
  getSquareCard,
  subscribePaidPlan,
  updateSquareCard,
  cancelSubscription,
}
