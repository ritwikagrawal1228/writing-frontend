import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Authenticator } from '@aws-amplify/ui-react'
import { CssBaseline } from '@mui/material'
import { Amplify } from 'aws-amplify'
import i18next from 'i18next'
import { ErrorBoundary } from 'react-error-boundary'
import { Provider } from 'react-redux'

import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/aws-exports'
import { Auth } from '@/components/templates/Auth'
import { Page500 } from '@/pages/500'
import { useStore } from '@/store'
import { onError } from '@/utils/onError'

Amplify.configure({ ...awsExports })

function App() {
  const store = useStore()
  i18next.changeLanguage(store.getState().lang.lang)

  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={Page500} onError={onError}>
        <Authenticator.Provider>
          <CssBaseline />
          <BrowserRouter>
            <Auth />
          </BrowserRouter>
        </Authenticator.Provider>
      </ErrorBoundary>
    </Provider>
  )
}

export default App
