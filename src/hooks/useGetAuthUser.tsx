import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'

import { userService } from '@/services/userService'
import { RootState } from '@/store'
import { userSlice } from '@/store/user'
import { User } from '@/types/model/user'

export const useGetAuthUser = (userStr: string) => {
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useDispatch()

  const { data, error } = useSWR<{ data: { user: User } }>(userStr, (query) =>
    userService.getAuthUser(),
  )

  useEffect(() => {
    dispatch(userSlice.actions.updateUser(data?.data.user))
  }, [data])

  return { user }
}
