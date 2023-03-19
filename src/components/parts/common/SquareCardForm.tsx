import React, { FC, useEffect, useRef, useState } from 'react'

import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RootState } from '@/store'

const darkModeCardStyle = {
  '.input-container': {
    borderColor: '#2D2D2D',
    borderRadius: '6px',
  },
  '.input-container.is-focus': {
    borderColor: '#006AFF',
  },
  '.input-container.is-error': {
    borderColor: '#ff1600',
  },
  '.message-text': {
    color: '#999999',
  },
  '.message-icon': {
    color: '#999999',
  },
  '.message-text.is-error': {
    color: '#ff1600',
  },
  '.message-icon.is-error': {
    color: '#ff1600',
  },
  input: {
    backgroundColor: '#2D2D2D',
    color: '#2D2D2D',
    fontFamily: 'helvetica neue, sans-serif',
  },
  'input::placeholder': {
    color: '#999999',
  },
  'input.is-error': {
    color: '#ff1600',
  },
}

type Props = {
  buttonText: string
  submit: (token: any) => void
}

export const SquareCardForm: FC<Props> = ({ buttonText, submit }) => {
  const { t } = useTranslation()
  const renderedRef = useRef(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [card, setCard] = useState()
  const colorMode = useSelector((state: RootState) => state.colorMode.colorMode)

  useEffect(() => {
    if (renderedRef.current) {
      return
    }
    // do something
    renderedRef.current = true
    if (!window.Square) {
      throw new Error('Square.js failed to load properly')
    }
    try {
      const payments = window.Square.payments(
        import.meta.env.VITE_SQUARE_APPLICATION_ID,
        import.meta.env.VITE_SQUARE_LOCATION_ID,
      )
      initializeCard(payments).then((c) => setCard(c))
    } catch (e) {
      console.error('Initializing Card failed', e)
      return
    }
  }, [])

  const initializeCard = async (payments: any) => {
    console.log(colorMode)

    const card = await payments.card({
      style: colorMode === 'dark' ? darkModeCardStyle : {},
    })
    await card.attach('#card-container')
    return card
  }

  // get token from card data
  async function tokenize(paymentMethod: any) {
    const tokenResult = await paymentMethod.tokenize()
    if (tokenResult.status === 'OK') {
      return tokenResult.token
    } else {
      throw new Error(
        `Tokenization errors: ${JSON.stringify(tokenResult.errors)}`,
      )
    }
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    // disable the submit button as we await tokenization and make a payment request.
    setIsButtonDisabled(true)
    const token = await tokenize(card)

    console.log(token)

    submit(token)
  }

  return (
    <>
      <form id="payment-form">
        <div id="card-container"></div>
        <Button
          color="secondary"
          sx={{ width: '100%' }}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          {buttonText}
        </Button>
      </form>
      <div id="payment-status-container"></div>
    </>
  )
}

SquareCardForm.displayName = 'SquareCardForm'
