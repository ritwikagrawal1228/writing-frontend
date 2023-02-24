import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User } from '@/types/model/user'

export type UserState = {
  user?: User
}

export type UpdateUserPayload = User | undefined

const initialState: UserState = {
  user: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<UpdateUserPayload>) {
      state.user = action.payload
    },
    reset(): UserState {
      return initialState
    },
  },
})
