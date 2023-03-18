import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Breadcrumb = {
  label: string
  href?: string
}

export type BreadcrumbsState = {
  breadcrumbs: Breadcrumb[]
}

export type UpdateBreadcrumbsPayload = Breadcrumb[]

const initialState: BreadcrumbsState = {
  breadcrumbs: [],
}

export const breadcrumbsSlice = createSlice({
  name: 'breadcrumbs',
  initialState,
  reducers: {
    updateBreadcrumbs(state, action: PayloadAction<UpdateBreadcrumbsPayload>) {
      state.breadcrumbs = action.payload
    },

    reset(): BreadcrumbsState {
      return initialState
    },
  },
})
