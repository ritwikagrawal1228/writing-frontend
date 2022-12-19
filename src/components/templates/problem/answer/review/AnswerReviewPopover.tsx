import React, { FC, useState } from 'react'

import RateReviewIcon from '@mui/icons-material/RateReview'
import { PortalProps, IconButton, useTheme } from '@mui/material'
import { createPortal } from 'react-dom'

import { useTextSelection } from '@/hooks/useTextSelection'

const Portal: FC<PortalProps> = ({ children }) => {
  return createPortal(children, document.body)
}

type Props = {
  target?: HTMLElement
}

export const AnswerReviewPopover: FC<Props> = ({ target }) => {
  const { isCollapsed, clientRect, startOffset, endOffset } =
    useTextSelection(target)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const theme = useTheme()
  if (clientRect == null || isCollapsed) return null

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(true)
  }

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    setIsOpen(false)
  }

  return (
    <>
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
          onClick={handleClick}
        >
          <RateReviewIcon />
        </IconButton>
      </Portal>
    </>
  )
}
