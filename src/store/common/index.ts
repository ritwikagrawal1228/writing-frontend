import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SnackBarState = {
  isSnackbarShow: boolean
  snackBarMsg: string
  snackBarType: 'success' | 'error' | 'info' | 'warning' | undefined
}

export type DialogState = {
  isDialogShow: boolean
  titleText: string
  contentText: string
  cancelText: string
  actionText: string
  onAction: (result: boolean | undefined) => void
}

export type CommonState = {
  isBackdropShow: boolean
  snackBarState: SnackBarState
  dialogState: DialogState
}

export type UpdateIsBackdropShowPayload = boolean
export type UpdateSnackbarPayload = SnackBarState

const initialState: CommonState = {
  isBackdropShow: false,
  snackBarState: {
    isSnackbarShow: false,
    snackBarMsg: '',
    snackBarType: undefined,
  },
  dialogState: {
    isDialogShow: false,
    titleText: '',
    contentText: '',
    cancelText: '',
    actionText: '',
    onAction: () => {
      //
    },
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
    updateDialog(state, action: PayloadAction<DialogState>) {
      state.dialogState = action.payload
    },
    closeDialog(state) {
      state.dialogState.isDialogShow = false
    },
    reset(): CommonState {
      return initialState
    },
  },
})
