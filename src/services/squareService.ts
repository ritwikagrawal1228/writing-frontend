import axios from 'axios'
import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { SquareCard } from '@/types/model/squareCard'

const getSquareCard = async () => {
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

  return await axios.post<{ getSquareCard: SquareCard }>(Path.APIGraphql, {
    query,
    variables: {},
  })
}

const subscribePaidPlan = async (token: string) => {
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

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

const updateSquareCard = async (token: string) => {
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

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

export const squareService = {
  getSquareCard,
  subscribePaidPlan,
  updateSquareCard,
}
