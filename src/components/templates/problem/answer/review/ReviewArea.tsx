import { useRouter } from 'next/router'
import React, { FC, Fragment, memo, useEffect } from 'react'

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
  Modal,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import { MyReview } from './MyReview'

import { Path } from '@/constants/Path'
import { ProblemType1 } from '@/constants/ProblemType'
import { UserPlanFree } from '@/constants/UserPlans'
import { reviewService } from '@/services/reviewService'
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

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
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
  const ta = useTranslations('Answer')
  const router = useRouter()
  const [reviews, setReviews] = React.useState<Review[]>([])
  const theme = useTheme()
  const [value, setValue] = React.useState(
    answer.problem.taskType === ProblemType1 ? 1 : 0,
  )
  const [isWaitingAiReview, setIsWaitingAiReview] = React.useState(false)
  const [isLoadingOwnReview, setIsLoadingOwnReview] = React.useState(false)
  const [isModalShow, setIsModalShow] = React.useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleModalClose = () => {
    setIsModalShow(false)
  }

  const sendReviewRequestToAI = () => {
    if (user?.plan === UserPlanFree) {
      setIsModalShow(true)
      return
    }
    setIsWaitingAiReview(true)
    reviewService
      .getAiReviewByAnswerId(answer.id, router.locale || 'ja')
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
      <Modal open={isModalShow} onClose={handleModalClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {ta('review.tabContentModalTitle')}
          </Typography>
          <Typography id="modal-modal-description" sx={{ my: 2 }}>
            {ta('review.tabContentModalContent')}
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleModalClose}
            sx={{ mr: 1 }}
          >
            {ta('review.tabContentModalCancelBtn')}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => router.push(Path.PaymentSubscription)}
          >
            {ta('review.tabContentModalUpgradeBtn')}
          </Button>
        </Box>
      </Modal>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label={ta('review.tabMenuAi')}
                disabled={answer.problem.taskType === ProblemType1}
                {...a11yProps(0)}
              />
              <Tab label={ta('review.tabMenuMy')} {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {reviews.find((r) => r.userId === 'AI') ? (
              <Box sx={{ display: 'flex' }}>
                <Avatar color="primary">
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
                  {ta('review.tabContentInfo')}
                </Alert>
                <Alert severity="warning" sx={{ width: '100%', mb: 1 }}>
                  ○ {ta('review.tabContentWarning1')} <br />○{' '}
                  {ta('review.tabContentWarning2')} <br />○{' '}
                  {ta('review.tabContentWarning3')} <br />
                </Alert>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={sendReviewRequestToAI}
                >
                  {ta('review.tabContentRequestButton')}
                </Button>
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MyReview
              reviews={reviews}
              setReviews={setReviews}
              isLoading={isLoadingOwnReview}
              setIsLoading={setIsLoadingOwnReview}
              answerId={answer.id}
            />
          </TabPanel>
        </Box>
      </Paper>
    </>
  )
})

ReviewArea.displayName = 'ReviewArea'
