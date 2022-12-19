import React, { FC, memo, useCallback, useState } from 'react'

import RateReviewIcon from '@mui/icons-material/RateReview'
import { Typography, Alert } from '@mui/material'

import { AnswerReviewPopover } from './AnswerReviewPopover'

type Props = {
  answer: string
}

export const AnswerArea: FC<Props> = memo(({ answer }) => {
  const [target, setTarget] = useState<HTMLElement | undefined>()

  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (el !== null || el !== undefined) {
        setTarget(el || undefined)
      } else {
        setTarget(undefined)
      }
    },
    [target],
  )

  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Answer
      </Typography>
      <Alert severity="info" sx={{ width: '100%', mb: 1 }}>
        Select the text you want to review
        <br /> and click the <RateReviewIcon
          color="primary"
          fontSize="small"
        />{' '}
        button to review.
      </Alert>
      <div>
        <div ref={ref}>{answer}</div>
        <AnswerReviewPopover target={target} />
      </div>
    </>
  )
})

AnswerArea.displayName = 'AnswerArea'
