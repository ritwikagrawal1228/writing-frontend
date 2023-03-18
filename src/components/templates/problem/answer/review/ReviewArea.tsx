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

import { MyReview } from './MyReview'

import { Path } from '@/constants/Path'
import { ProblemType1 } from '@/constants/ProblemType'
import { UserPlanFree } from '@/constants/UserPlans'
import { reviewService } from '@/services/reviewService'
import { Answer } from '@/types/model/answer'
import { Review } from '@/types/model/review'
import { User } from '@/types/model/user'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useNavigate } from 'react-router-dom'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { commonSlice } from '@/store/common'

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
  const { t } = useTranslation()
  const amplifyUser = useSelector((state: RootState) => state.user.amplifyUser)
  const [reviews, setReviews] = React.useState<Review[]>([])
  const theme = useTheme()
  const [value, setValue] = React.useState(
    answer.problem.taskType === ProblemType1 ? 1 : 0,
  )
  const [isWaitingAiReview, setIsWaitingAiReview] = React.useState(false)
  const lang = useSelector((state: RootState) => state.lang.lang)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const sendReviewRequestToAI = () => {
    if (user?.plan === UserPlanFree) {
      dispatch(
        commonSlice.actions.updateDialog({
          isDialogShow: true,
          titleText: t('Answer.review.tabContentModalTitle'),
          contentText: t('Answer.review.tabContentModalContent'),
          cancelText: t('Answer.review.tabContentModalCancelBtn'),
          actionText: t('Answer.review.tabContentModalUpgradeBtn'),
          onAction: () => navigate(Path.PaymentSubscription),
        }),
      )
      return
    }
    setIsWaitingAiReview(true)
    reviewService
      .getAiReviewByAnswerId(answer.id, lang, amplifyUser)
      .then(({ createAiReview }) => {
        const rs = [...reviews]
        rs.push(createAiReview)
        setReviews(rs)
      })
      .finally(() => {
        setIsWaitingAiReview(false)
      })
  }

  useEffect(() => {
    setIsWaitingAiReview(true)
    reviewService
      .getReviewsByAnswerId(answer.id, amplifyUser)
      .then(({ reviewsByAnswerId }) => {
        if (reviewsByAnswerId) {
          setReviews(reviewsByAnswerId)
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
                label={t('Answer.review.tabMenuAi')}
                disabled={answer.problem.taskType === ProblemType1}
                {...a11yProps(0)}
              />
              <Tab label={t('Answer.review.tabMenuMy')} {...a11yProps(1)} />
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
                  {t('Answer.review.tabContentInfo')}
                </Alert>
                <Alert severity="warning" sx={{ width: '100%', mb: 1 }}>
                  ○ {t('Answer.review.tabContentWarning1')} <br />○{' '}
                  {t('Answer.review.tabContentWarning2')} <br />○{' '}
                  {t('Answer.review.tabContentWarning3')} <br />
                </Alert>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={sendReviewRequestToAI}
                >
                  {t('Answer.review.tabContentRequestButton')}
                </Button>
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MyReview
              reviews={reviews}
              setReviews={setReviews}
              answerId={answer.id}
            />
          </TabPanel>
        </Box>
      </Paper>
    </>
  )
})

ReviewArea.displayName = 'ReviewArea'
