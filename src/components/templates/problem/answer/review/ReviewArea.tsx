import React, { FC, Fragment, memo } from 'react'

import { Button, Paper, TextField, Typography } from '@mui/material'

import { reviewService } from '@/services/reviewService'
import { Answer } from '@/types/model/answer'
import { User } from '@/types/model/user'

type Props = {
  answer: Answer
  user?: User
}

export const ReviewArea: FC<Props> = memo(({ answer, user }) => {
  const [review, setReview] = React.useState<string>('')

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReview(e.target.value)
  }

  const sendReview = () => {
    reviewService
      .createReview(answer.id, review)
      .then(({ data }) => console.log(data.createReview))
  }

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Review
        </Typography>
        <TextField
          color="secondary"
          fullWidth
          multiline
          rows={4}
          id=""
          label=""
          value={review}
          onChange={handleReviewChange}
          placeholder="Write your review here"
        />
        <Button onClick={sendReview} variant="contained" color="secondary">
          Send
        </Button>
      </Paper>
    </>
  )
})

ReviewArea.displayName = 'ReviewArea'
