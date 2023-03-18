import {
  configureStore,
  combineReducers,
  EnhancedStore,
} from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import { breadcrumbsSlice } from './breadcrumbs'
import { colorModeSlice } from './colorMode'

import { commonSlice } from '@/store/common'
import { langSlice } from '@/store/i18n'
import { userSlice } from '@/store/user'

// HACK: `redux-persist failed to create sync storage. falling back to noop storage.`の対応
// https://github.com/vercel/next.js/discussions/15687#discussioncomment-45319
const createNoopStorage = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setItem(_key: string, value: any) {
      return Promise.resolve(value)
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

const rootReducer = combineReducers({
  user: userSlice.reducer,
  common: commonSlice.reducer,
  lang: langSlice.reducer,
  breadcrumbs: breadcrumbsSlice.reducer,
  colorMode: colorModeSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

const persistConfig = {
  key: 'p-next-test',
  version: 1,
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const useStore = (): EnhancedStore => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
}
