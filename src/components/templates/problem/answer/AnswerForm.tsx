import React, { memo, useEffect } from 'react'

import SendIcon from '@mui/icons-material/Send'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { Storage } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import { ProblemDisplayPaper } from '../../common/ProblemDisplayPaper'

import { ProblemDescriptionGrid } from '@/components/templates/common/ProblemDescriptionGrid'
import { Stopwatch } from '@/components/templates/common/Stopwatch'
import { AnswerStatus, answerStatus } from '@/constants/AnswerStatus'
import { fontSizes } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
  answer: string
  setAnswer: React.Dispatch<React.SetStateAction<string>>
  countDownSec: number
  setCountDownSec: React.Dispatch<React.SetStateAction<number>>
  handleSubmit: (isSave: boolean, status: AnswerStatus) => void
  time: number
  setTime: React.Dispatch<React.SetStateAction<number>>
}

export const AnswerForm = memo(
  ({
    problem,
    answer,
    setAnswer,
    countDownSec,
    setCountDownSec,
    handleSubmit,
    time,
    setTime,
  }: Props) => {
    const t = useTranslations('Problem')
    const ta = useTranslations('Answer')
    const [img, setImg] = React.useState<string | undefined>()
    const [error, setError] = React.useState<string>('')
    const [isCancelConfirm, setIsCancelConfirm] = React.useState<boolean>(false)

    useEffect(() => {
      if (problem.questionImageKey) {
        Storage.get(problem.questionImageKey)
          .then((res) => {
            setImg(res)
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }, [problem])

    const submitAnswer = async () => {
      setError('')
      if (!answer) {
        setError('Answer is required')
        return
      }

      handleSubmit(true, answerStatus.completed)
    }

    const handleCloseCancelConfirm = () => {
      setIsCancelConfirm(false)
    }

    const handleCancel = async (isSave: boolean) => {
      setIsCancelConfirm(false)
      if (!isSave) {
        handleSubmit(false, answerStatus.inProgress)
        return
      }

      handleSubmit(true, answerStatus.inProgress)
    }

    return (
      <>
        <Dialog open={isCancelConfirm} onClose={handleCloseCancelConfirm}>
          <DialogTitle>Quit answering?</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              You can save your answer and continue later.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => handleCancel(false)}
            >
              Quit without saving
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => handleCancel(true)}
            >
              Save and Quit
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={handleCloseCancelConfirm}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container alignItems="center">
          <Grid item xs={6}>
            <Typography fontSize={fontSizes.xxl} fontWeight="bold">
              {problem.title}
            </Typography>
          </Grid>
          <Grid item xs={3} textAlign="start">
            <Stopwatch
              time={time}
              setTime={setTime}
              countDownSec={countDownSec}
              setCountDownSec={setCountDownSec}
            />
          </Grid>
          <Grid item xs={3} textAlign="right">
            <Button
              color="inherit"
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => setIsCancelConfirm(true)}
            >
              <b>Quit</b>
            </Button>
            <Button
              color="primary"
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() => submitAnswer()}
            >
              <b>Submit</b>
            </Button>
          </Grid>
        </Grid>
        <ProblemDescriptionGrid problem={problem} />
        {error && (
          <Grid item xs={12} sx={{ my: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid container columnSpacing={2}>
          <Grid item xs={6}>
            <ProblemDisplayPaper problem={problem} img={img} />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ width: '100%', minHeight: '600px', p: 3 }}>
              <TextField
                inputProps={{ style: { fontSize: fontSizes.m } }}
                color="secondary"
                fullWidth
                multiline
                rows={30}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <Typography sx={{ mt: 1 }}>
                Word Count: {answer ? answer.trim().split(/\s+/).length : 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  },
)

AnswerForm.displayName = 'AnswerForm'
