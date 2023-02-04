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

export const squareService = {
  getSquareCard,
}
