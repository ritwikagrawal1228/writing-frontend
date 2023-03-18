import { useDispatch } from 'react-redux'

import { Breadcrumb, breadcrumbsSlice } from '@/store/breadcrumbs'

export const useSetBreadcrumbs = (b: Breadcrumb[]) => {
  const dispatch = useDispatch()
  dispatch(breadcrumbsSlice.actions.updateBreadcrumbs(b))
}
