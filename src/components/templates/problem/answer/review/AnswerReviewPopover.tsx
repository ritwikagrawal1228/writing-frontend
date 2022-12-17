import React, { FC, memo, useCallback, useState } from 'react'

import { css } from '@emotion/react'
import {
  Button,
  PortalProps,
  IconButton,
  Typography,
  Alert,
} from '@mui/material'
import { createPortal } from 'react-dom'
import RateReviewIcon from '@mui/icons-material/RateReview'

import { useTextSelection } from '@/hooks/useTextSelection'

const Portal: FC<PortalProps> = ({ children }) => {
  return createPortal(children, document.body)
}

type Props = {
  target?: HTMLElement
}

export const AnswerReviewPopover: FC<Props> = ({ target }) => {
  const { isCollapsed, clientRect } = useTextSelection(target)
  console.log(isCollapsed, clientRect)

  if (clientRect == null || isCollapsed) return null

  return (
    <Portal>
      <IconButton
        color="primary"
        size="medium"
        sx={{
          position: 'absolute',
          left: `${clientRect.left + clientRect.width / 2}px`,
          top: `${clientRect.top + 60}px`,
          marginLeft: '-50px',
        }}
      >
        <RateReviewIcon />
      </IconButton>
    </Portal>
  )
}
