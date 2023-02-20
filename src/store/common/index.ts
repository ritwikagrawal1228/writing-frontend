import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type snackBarState = {
  isSnackbarShow: boolean
  snackBarMsg: string
  snackBarType: 'success' | 'error' | 'info' | 'warning'
}

export type CommonState = {
  isBackdropShow: boolean
  snackBarState: snackBarState
}

export type UpdateIsBackdropShowPayload = boolean
export type UpdateSnackbarPayload = snackBarState

const initialState: CommonState = {
  isBackdropShow: false,
  snackBarState: {
    isSnackbarShow: false,
    snackBarMsg: '',
    snackBarType: 'success',
  },
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    updateIsBackdropShow(
      state,
      action: PayloadAction<UpdateIsBackdropShowPayload>,
    ) {
      state.isBackdropShow = action.payload
    },
    updateSnackBar(state, action: PayloadAction<UpdateSnackbarPayload>) {
      state.snackBarState = action.payload
    },
    reset(): CommonState {
      return initialState
    },
  },
})
