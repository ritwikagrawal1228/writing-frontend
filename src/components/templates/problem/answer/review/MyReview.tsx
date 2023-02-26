import React, { FC, memo, useEffect, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useSelector } from 'react-redux'

import { ProfileAvatar } from '@/components/parts/common/ProfileAvatar'
import { reviewService } from '@/services/reviewService'
import { RootState } from '@/store'
import { fontSizes } from '@/themes/globalStyles'
import { Review } from '@/types/model/review'

type Props = {
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  answerId: string
  reviews: Review[]
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
}

export const MyReview: FC<Props> = memo(
  ({ reviews, setReviews, isLoading, setIsLoading, answerId }) => {
    const user = useSelector((state: RootState) => state.user.user)
    const theme = useTheme()
    const [myReviewValue, setMyReviewValue] = useState<string>('')
    const saveOwnReview = () => {
      setIsLoading(true)
      reviewService
        .createReview(answerId, myReviewValue)
        .then(({ data }) => {
          const rs = [...reviews]
          rs.push(data.createReview)
          setReviews(rs)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }

    useEffect(() => {
      // do something
    }, [])

    return (
      <>
        {reviews.find((review) => review.userId === user?.id) ? (
          <Box sx={{ display: 'flex' }}>
            <ProfileAvatar user={user} />
            <Box
              sx={{
                backgroundColor: `${theme.palette.primary.main}14`,
                ml: 2,
                borderRadius: 4,
                padding: 2,
              }}
            >
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                {reviews.find((review) => review.userId === user?.id)?.content}
              </Typography>
            </Box>
          </Box>
        ) : isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              inputProps={{ style: { fontSize: fontSizes.m } }}
              color="secondary"
              fullWidth
              multiline
              rows={5}
              value={myReviewValue}
              onChange={(e) => setMyReviewValue(e.target.value)}
              placeholder="You can write feedback on your own answer."
            />
            <Button
              color="secondary"
              variant="contained"
              onClick={saveOwnReview}
            >
              Save
            </Button>
          </>
        )}
      </>
    )
  },
)

MyReview.displayName = 'MyReview'
