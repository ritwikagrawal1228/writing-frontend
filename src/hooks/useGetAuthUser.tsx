import React, { useEffect } from 'react'

import useSWR from 'swr'

import { userService } from '@/services/userService'
import { User } from '@/types/model/user'

export const useGetAuthUser = (userStr: string) => {
  const [user, setUser] = React.useState<User>()

  const { data, error } = useSWR<{ data: { user: User } }>(userStr, (query) =>
    userService.getAuthUser(),
  )

  useEffect(() => {
    setUser(data?.data.user)
  }, [data])

  return { user, setUser }
}
