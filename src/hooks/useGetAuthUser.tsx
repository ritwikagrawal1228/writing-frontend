import React, { useEffect, useMemo } from 'react'

import { gql } from 'graphql-request'
import useSWR from 'swr'

import { Path } from '@/constants/Path'
import { User } from '@/types/model/user'
import { axios } from '@/utils/axios'

type UserData = {
  data: {
    user: User
  }
}

export const useGetAuthUser = (userStr: string) => {
  const userObj = JSON.parse(userStr || '{}')
  const [user, setUser] = React.useState<User>()

  const getQuery = useMemo(() => {
    return gql`
      query ($userId: ID!) {
        user(userId: $userId) {
          id
          plan
          email
          userType
          isAdmin
          profileImageUrl
          studyTarget
          introduction
          isSubscribeEmail
          isSubscribePush
        }
      }
    `
  }, [userStr])

  const { data, error } = useSWR<UserData>(getQuery, (query) =>
    axios.post(Path.APIGraphql, { query, variables: undefined }),
  )

  useEffect(() => {
    setUser(data?.data.user)
  }, [data])

  return { user }
}
