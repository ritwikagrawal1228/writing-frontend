import React, { FC, Fragment, memo, useEffect } from 'react'

import { Paper, Box, Tabs, Tab, Button, Alert } from '@mui/material'

import { reviewService } from '@/services/reviewService'
import { Answer } from '@/types/model/answer'
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
  const [review, setReview] = React.useState<string>('')
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const sendReviewRequestToAI = () => {
    reviewService.getAiReviewByAnswerId(answer.id).then((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    reviewService.getReviewByAnswerId(answer.id).then(({ data }) => {
      if (data.reviewByAnswerId.content) {
        setReview(data.reviewByAnswerId.content)
      }
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
              <Tab label={<>AI Review</>} {...a11yProps(0)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Alert severity="info" sx={{ width: '100%', mb: 1 }}>
              On clicking the button below, AI will review your answer
            </Alert>
            <Button
              color="secondary"
              variant="contained"
              onClick={sendReviewRequestToAI}
            >
              Request AI review
            </Button>
          </TabPanel>
        </Box>
      </Paper>
    </>
  )
})

ReviewArea.displayName = 'ReviewArea'
