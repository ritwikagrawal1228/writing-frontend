import React, { FC, useEffect } from 'react'

import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AnsweringForm } from '@/types/form/AnsweringForm'

export const Stopwatch: FC = () => {
  const { t } = useTranslation()
  const [isStartConfirm, setIsStartConfirm] = React.useState<boolean>(false)
  const [isPauseConfirm, setIsPauseConfirm] = React.useState<boolean>(false)
  const [isResumeConfirm, setIsResumeConfirm] = React.useState<boolean>(false)
  const [isPaused, setIsPaused] = React.useState<boolean>(false)
  const [isActive, setIsActive] = React.useState(false)
  const { control, setValue } = useFormContext<AnsweringForm>()
  const watchForm = useWatch<AnsweringForm>({
    control,
  })
  const [count, setCount] = React.useState<number>(watchForm.countDownSec || 0)

  useEffect(() => {
    setCount(watchForm.countDownSec || 0)
    if (watchForm.countDownSec || 0 > 0) {
      setIsActive(true)
      setIsPaused(true)
      setIsResumeConfirm(true)
    } else {
      setIsStartConfirm(true)
    }
  }, [])

  useEffect(() => {
    setValue('countDownSec', count)
  }, [count])

  React.useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setCount((count) => count + 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => {
      clearInterval(interval)
    }
  }, [isActive, isPaused])

  const handleCloseStartConfirm = () => {
    setIsStartConfirm(false)
  }
  const handleClosePauseConfirm = () => {
    setIsPauseConfirm(false)
  }
  const handleCloseResumeConfirm = () => {
    setIsResumeConfirm(false)
  }

  const handleStartTimer = () => {
    setIsActive(true)
    setIsPaused(false)

    handleCloseStartConfirm()
  }

  const handlePauseTimer = () => {
    setIsPaused(!isPaused)
    handleClosePauseConfirm()
    handleCloseResumeConfirm()
  }

  return (
    <>
      {watchForm.countDownSec || 0 > 0 ? (
        <Button
          startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
          color="inherit"
          variant="outlined"
          sx={{ textTransform: 'none' }}
          onClick={
            isPaused
              ? () => setIsResumeConfirm(true)
              : () => setIsPauseConfirm(true)
          }
        >
          <Typography>
            <span style={{ fontWeight: 'bold' }}>
              {Math.floor((watchForm.time || 0) - count / 60)}
            </span>{' '}
            minutes left
          </Typography>
        </Button>
      ) : (
        <Button
          color="secondary"
          startIcon={<PlayArrowIcon />}
          variant="contained"
          onClick={() => setIsStartConfirm(true)}
        >
          <Typography>{t('Answer.form.startButton')}</Typography>
        </Button>
      )}
      <Dialog open={isStartConfirm} onClose={handleCloseStartConfirm}>
        <DialogTitle>{t('Answer.form.startDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('Answer.form.startDialogDescription')}
          </DialogContentText>
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                color="secondary"
                margin="dense"
                id="name"
                label={t('Answer.form.startDialogInputLabel')}
                type="number"
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {t('Answer.form.startMinUnit')}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseStartConfirm}
          >
            {t('Answer.form.startDialogCancelButton')}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => handleStartTimer()}
          >
            {t('Answer.form.startDialogStartButton')}!
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isPauseConfirm} onClose={handleClosePauseConfirm}>
        <DialogTitle>{t('Answer.form.pauseDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('Answer.form.pauseDialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleClosePauseConfirm}
          >
            {t('Answer.form.pauseDialogCancelButton')}
          </Button>
          <Button color="secondary" onClick={() => handlePauseTimer()}>
            {t('Answer.form.pauseDialogPauseButton')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isResumeConfirm} onClose={handleCloseResumeConfirm}>
        <DialogTitle>{t('Answer.form.resumeDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {t('Answer.form.resumeDialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseResumeConfirm}
          >
            {t('Answer.form.resumeDialogCancelButton')}
          </Button>
          <Button color="secondary" onClick={() => handlePauseTimer()}>
            {t('Answer.form.resumeDialogResumeButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
