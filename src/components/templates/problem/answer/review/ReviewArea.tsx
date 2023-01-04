import React, { FC, Fragment, memo } from 'react'

import { Paper } from '@mui/material'

import { Answer } from '@/types/model/answer'

type Props = {
  answer: Answer
}

export const ReviewArea: FC<Props> = memo(({ answer }) => {
  return (
    <>
      <Paper>Review from your tutor</Paper>
    </>
  )
})

ReviewArea.displayName = 'ReviewArea'
