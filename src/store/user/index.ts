import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { User } from '@/types/model/user'

export type UserState = {
  user: User
}

export type UpdateUserPayload = User

const initialState: UserState = {
  user: {
    id: '',
    name: '',
    plan: 'FREE',
    email: '',
    userType: 'STUDENT',
    isAdmin: false,
    profileImageUrl: '',
    studyTarget: '',
    introduction: '',
    subscriptionExpiresAt: '',
    isSubscribeEmail: false,
    isSubscribePush: false,
  },
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
