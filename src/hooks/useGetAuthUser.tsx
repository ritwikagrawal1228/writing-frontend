import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'

import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'

import { Path } from '@/constants/Path'
import { userService } from '@/services/userService'
import { RootState } from '@/store'
import { userSlice } from '@/store/user'

export const useGetAuthUser = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const dispatch = useDispatch()
  const router = useRouter()

  useLayoutEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        userService.getAuthUser().then(({ data }) => {
          dispatch(userSlice.actions.updateUser(data.user))
        })
      })
      // if there is no authenticated user, redirect to profile page
      .catch(() => router.push(Path.Auth))
  }, [])

  return { user }
}
