import { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { userService } from '@/services/userService'
import { RootState } from '@/store'
import { userSlice } from '@/store/user'

export const useGetAuthUser = (userStr: string) => {
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      return
    }
    userService.getAuthUser().then(({ data }) => {
      dispatch(userSlice.actions.updateUser(data.user))
    })
  }, [userStr])

  return { user }
}
