import { useLayoutEffect } from 'react'

import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'

import { userService } from '@/services/userService'
import { RootState } from '@/store'
import { userSlice } from '@/store/user'

export const useGetAuthUser = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const amplifyUser = useSelector((state: RootState) => state.user.amplifyUser)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    Auth.currentAuthenticatedUser().then((user) => {
      if (!user) {
        return
      }

      dispatch(userSlice.actions.updateAmplifyUser(user))

      userService.getAuthUser(user).then(({ user }) => {
        dispatch(userSlice.actions.updateUser(user))
      })
    })
  }, [])

  return { user, amplifyUser }
}
