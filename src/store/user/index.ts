import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User } from '@/types/model/user'
import { AmplifyUser } from '@/types/model/amplifyUser'

export type UserState = {
  user?: User
  amplifyUser?: AmplifyUser
}

export type UpdateUserPayload = User | undefined
export type UpdateAmplifyUserPayload = AmplifyUser | undefined

const initialState: UserState = {
  user: undefined,
  amplifyUser: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<UpdateUserPayload>) {
      state.user = action.payload
    },
    updateAmplifyUser(state, action: PayloadAction<UpdateAmplifyUserPayload>) {
      state.amplifyUser = action.payload
    },
    reset(): UserState {
      return initialState
    },
  },
})
