import React, { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import SendIcon from '@mui/icons-material/Send'
import {
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
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ProblemDisplayPaper } from '../../common/ProblemDisplayPaper'

import { ProblemDescriptionGrid } from '@/components/templates/common/ProblemDescriptionGrid'
import { Stopwatch } from '@/components/templates/common/Stopwatch'
import { answerStatus } from '@/constants/AnswerStatus'
import { Path } from '@/constants/Path'
import { usePrompt } from '@/hooks/usePrompt'
import { fontSizes } from '@/themes/globalStyles'
import { AnsweringForm } from '@/types/form/AnsweringForm'
import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
  handleSubmit: () => void
}

export const AnswerForm = memo(({ problem, handleSubmit }: Props) => {
  const { t } = useTranslation()
  const [img, setImg] = React.useState<string | undefined>()
  const [isCancelConfirm, setIsCancelConfirm] = React.useState<boolean>(false)
  const { control, setValue } = useFormContext<AnsweringForm>()
  const watchForm = useWatch<AnsweringForm>({
    control,
  })
  const navigate = useNavigate()
  const [isBlock, setIsBlock] = React.useState<boolean>(true)

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

  useEffect(() => {
    setIsBlock(true)
  }, [watchForm.answer])

  const handleCloseCancelConfirm = () => {
    setIsCancelConfirm(false)
  }

  const quit = async () => {
    setIsCancelConfirm(false)
    setIsBlock(false)
    navigate(Path.ProblemDetail.replace(':problemId', problem.id))
  }

  const saveQuit = () => {
    setIsCancelConfirm(false)
    setIsBlock(false)
    handleSubmit()
  }

  const submit = () => {
    setValue('status', answerStatus.completed)
    setIsBlock(false)
    handleSubmit()
  }

  usePrompt(saveQuit, isBlock)

  return (
    <>
      <Dialog open={isCancelConfirm} onClose={handleCloseCancelConfirm}>
        <DialogTitle>{t('Answer.form.quitDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('Answer.form.quitDialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={quit}>
            {t('Answer.form.quitDialogWithoutSavingButton')}
          </Button>
          <Button color="secondary" onClick={saveQuit}>
            {t('Answer.form.quitDialogSavingButton')}
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseCancelConfirm}
          >
            {t('Answer.form.quitDialogCancelButton')}
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
          <Stopwatch />
        </Grid>
        <Grid item xs={3} textAlign="right">
          <Button
            color="inherit"
            variant="outlined"
            sx={{ mr: 2 }}
            onClick={() =>
              navigate(Path.ProblemDetail.replace(':problemId', problem.id))
            }
          >
            <b>{t('Answer.form.quitButton')}</b>
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => submit()}
          >
            <b>Submit</b>
          </Button>
        </Grid>
      </Grid>
      <ProblemDescriptionGrid problem={problem} />
      <Paper sx={{ width: '100%' }}>
        <Grid container columnSpacing={2}>
          <Grid item xs={6}>
            <ProblemDisplayPaper problem={problem} img={img} />
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ width: '100%', minHeight: '600px', p: 3 }}>
              <Controller
                name="answer"
                control={control}
                render={({ field }) => (
                  <TextField
                    inputProps={{
                      style: { fontSize: fontSizes.m },
                      spellCheck: 'false',
                    }}
                    color="secondary"
                    fullWidth
                    multiline
                    rows={35}
                    {...field}
                  />
                )}
              />
              <Typography sx={{ mt: 1 }}>
                Word Count:{' '}
                {watchForm.answer
                  ? watchForm.answer.trim().split(/\s+/).length
                  : 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
})

AnswerForm.displayName = 'AnswerForm'
