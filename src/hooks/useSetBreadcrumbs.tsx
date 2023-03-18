import { useLayoutEffect } from 'react'

import { Auth } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'

import { userService } from '@/services/userService'
import { RootState } from '@/store'
import { userSlice } from '@/store/user'
import { Breadcrumb, breadcrumbsSlice } from '@/store/breadcrumbs'

export const useSetBreadcrumbs = (b: Breadcrumb[]) => {
  const dispatch = useDispatch()
  dispatch(breadcrumbsSlice.actions.updateBreadcrumbs(b))
}
