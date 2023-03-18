import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Authenticator } from '@aws-amplify/ui-react'
import { CssBaseline } from '@mui/material'
import { Amplify } from 'aws-amplify'
import { Provider } from 'react-redux'

import '@aws-amplify/ui-react/styles.css'

import awsExports from '@/aws-exports'
import { Auth } from '@/components/templates/Auth'
import { useStore } from '@/store'

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
