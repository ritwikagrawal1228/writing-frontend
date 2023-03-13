import { useRouter } from 'next/router'
import React, { FC, memo } from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Button, SxProps, Theme } from '@mui/material'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'

type Props = {
  color?: 'primary' | 'secondary'
  variant?: 'contained' | 'outlined'
  sx?: SxProps<Theme>
  text?: string
  fullWidth?: boolean
}

const TRACKING_ID = process.env.NEXT_PUBLIC_GA4_TRACKING_ID as string

export const StartButton: FC<Props> = memo(
  ({
    color = 'primary',
    variant = 'contained',
    sx,
    text,
    fullWidth = false,
  }) => {
    const router = useRouter()
    const t = useTranslations('LP')
    const start = () => {
      if (TRACKING_ID || !router.isPreview) {
        gtag('event', 'start', {
          page_path: window.location.pathname,
          send_to: TRACKING_ID,
        })
      }
      router.push(Path.Auth)
    }

    return (
      <>
        <Button
          sx={sx}
          color={color}
          variant={variant}
          onClick={start}
          endIcon={<DoubleArrowIcon />}
          fullWidth={fullWidth}
        >
          {text || t('startFreeButton')}
        </Button>
      </>
    )
  },
)

StartButton.displayName = 'StartButton'
