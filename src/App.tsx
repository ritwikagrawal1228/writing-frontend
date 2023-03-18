import React, { useMemo } from 'react'

import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'

import i18next from 'i18next'
import { getDesignTokens } from './themes/defaultTheme'
import awsExports from '@/aws-exports'
import { Amplify, I18n } from 'aws-amplify'
import {
  Authenticator,
  Button,
  Heading,
  Text,
  View,
  useAuthenticator,
  useTheme,
} from '@aws-amplify/ui-react'
import { Path } from '@/constants/Path'
import '@aws-amplify/ui-react/styles.css'
import { Provider, useSelector } from 'react-redux'
import { RootState, useStore } from '@/store'
import { dict } from '@/i18n/amplify'
import { Auth } from './components/templates/Auth'
import { BrowserRouter } from 'react-router-dom'

Amplify.configure({ ...awsExports })

function App() {
  const store = useStore()

  return (
    <Provider store={store}>
      <Authenticator.Provider>
        <CssBaseline />
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </Authenticator.Provider>
    </Provider>
  )
}

export default App
