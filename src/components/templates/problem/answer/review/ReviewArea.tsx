import React, { FC, Fragment, memo, useEffect, useState } from 'react'

import SmartToyIcon from '@mui/icons-material/SmartToy'
import {
  Paper,
  Box,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
  Typography,
  Avatar,
  useTheme,
  TextField,
} from '@mui/material'

import { ProfileAvatar } from '@/components/parts/common/ProfileAvatar'
import { ProblemType1 } from '@/constants/ProblemType'
import { reviewService } from '@/services/reviewService'
import { fontSizes } from '@/themes/globalStyles'
import { Answer } from '@/types/model/answer'
import { Review } from '@/types/model/review'
import { User } from '@/types/model/user'

type Props = {
  answer: Answer
  user?: User
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const ReviewArea: FC<Props> = memo(({ answer, user }) => {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [myReviewValue, setMyReviewValue] = useState<string>('')
  const theme = useTheme()
  const [value, setValue] = React.useState(
    answer.problem.taskType === ProblemType1 ? 1 : 0,
  )
  const [isWaitingAiReview, setIsWaitingAiReview] = React.useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const saveOwnReview = () => {
    setIsWaitingAiReview(true)
    reviewService
      .createReview(answer.id, myReviewValue)
      .then(({ data }) => {
        const rs = [...reviews]
        rs.push(data.createReview)
        setReviews(rs)
      })
      .finally(() => {
        setIsWaitingAiReview(false)
      })
  }

  const sendReviewRequestToAI = () => {
    setIsWaitingAiReview(true)
    reviewService
      .getAiReviewByAnswerId(answer.id)
      .then(({ data }) => {
        const rs = [...reviews]
        rs.push(data.createAiReview)
        setReviews(rs)
      })
      .finally(() => {
        setIsWaitingAiReview(false)
      })
  }

  useEffect(() => {
    setIsWaitingAiReview(true)
    reviewService
      .getReviewsByAnswerId(answer.id)
      .then(({ data }) => {
        if (data.reviewsByAnswerId) {
          setReviews(data.reviewsByAnswerId)
        }
      })
      .finally(() => {
        setIsWaitingAiReview(false)
      })
  }, [])

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="AI Review"
                disabled={answer.problem.taskType === ProblemType1}
                {...a11yProps(0)}
              />
              <Tab label="My Review" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {reviews.find((r) => r.userId === 'AI') ? (
              <Box sx={{ display: 'flex' }}>
                <Avatar>
                  <SmartToyIcon />
                </Avatar>
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}14`,
                    ml: 2,
                    borderRadius: 4,
                    padding: 2,
                  }}
                >
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {reviews.find((r) => r.userId === 'AI')?.content}
                  </Typography>
                </Box>
              </Box>
            ) : isWaitingAiReview ? (
              <CircularProgress />
            ) : (
              <>
                <Alert severity="info" sx={{ width: '100%', mb: 1 }}>
                  On clicking the button below, AI will review your answer
                </Alert>
                <Alert severity="warning" sx={{ width: '100%', mb: 1 }}>
                  ・May occasionally generate incorrect information <br />
                  ・May occasionally produce harmful instructions or biased
                  content <br />
                  ・Limited knowledge of world and events after 2021
                </Alert>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={sendReviewRequestToAI}
                >
                  Request Open AI review
                </Button>
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {reviews.find((r) => r.userId === user?.id) ? (
              <Box sx={{ display: 'flex' }}>
                <Box
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}14`,
                    mr: 2,
                    borderRadius: 4,
                    padding: 2,
                  }}
                >
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                    {reviews.find((r) => r.userId === user?.id)?.content}
                  </Typography>
                </Box>
                <ProfileAvatar user={user} />
              </Box>
            ) : isWaitingAiReview ? (
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
          </TabPanel>
        </Box>
      </Paper>
    </>
  )
})

ReviewArea.displayName = 'ReviewArea'
