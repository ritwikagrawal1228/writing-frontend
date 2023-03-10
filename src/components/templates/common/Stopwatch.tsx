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
import { useTranslations } from 'next-intl'

type Props = {
  time: number
  setTime: React.Dispatch<React.SetStateAction<number>>
  countDownSec: number
  setCountDownSec: React.Dispatch<React.SetStateAction<number>>
}

export const Stopwatch: FC<Props> = ({
  time,
  setTime,
  countDownSec,
  setCountDownSec,
}) => {
  const ta = useTranslations('Answer')
  const [isStartConfirm, setIsStartConfirm] = React.useState<boolean>(false)
  const [isPauseConfirm, setIsPauseConfirm] = React.useState<boolean>(false)
  const [isResumeConfirm, setIsResumeConfirm] = React.useState<boolean>(false)
  const [isPaused, setIsPaused] = React.useState<boolean>(false)
  const [isActive, setIsActive] = React.useState(false)

  useEffect(() => {
    if (countDownSec > 0) {
      setIsActive(true)
      setIsPaused(true)
    }
  }, [])

  React.useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setCountDownSec((time) => time + 1)
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
      {countDownSec > 0 ? (
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
              {Math.floor(time - countDownSec / 60)}
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
          <Typography>{ta('form.startButton')}</Typography>
        </Button>
      )}
      <Dialog open={isStartConfirm} onClose={handleCloseStartConfirm}>
        <DialogTitle>{ta('form.startDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {ta('form.startDialogDescription')}
          </DialogContentText>
          <TextField
            autoFocus
            color="secondary"
            margin="dense"
            id="name"
            label={ta('form.startDialogInputLabel')}
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {ta('form.startMinUnit')}
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseStartConfirm}
          >
            {ta('form.startDialogCancelButton')}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleStartTimer()}
          >
            {ta('form.startDialogStartButton')}!
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isPauseConfirm} onClose={handleClosePauseConfirm}>
        <DialogTitle>{ta('form.pauseDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {ta('form.pauseDialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleClosePauseConfirm}
          >
            {ta('form.pauseDialogCancelButton')}
          </Button>
          <Button color="secondary" onClick={() => handlePauseTimer()}>
            {ta('form.pauseDialogPauseButton')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isResumeConfirm} onClose={handleCloseResumeConfirm}>
        <DialogTitle>{ta('form.resumeDialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {ta('form.resumeDialogDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseResumeConfirm}
          >
            {ta('form.resumeDialogCancelButton')}
          </Button>
          <Button color="secondary" onClick={() => handlePauseTimer()}>
            {ta('form.resumeDialogResumeButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
