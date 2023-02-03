import axios from 'axios'
import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { SquareCard } from '@/types/model/squareCard'

const getSquareCard = async () => {
  const query = gql`
    query () {
      getSquareCardByUserId() {
        id
        cardBrand
        last4
        expMonth
        expYear
      }
    }
  `

  return await axios.post<{ getSquareCardByUserId: SquareCard }>(
    Path.APIGraphql,
    {
      query,
    },
  )
}

export const squareService = {
  getSquareCard,
}
