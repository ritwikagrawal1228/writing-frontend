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
          <Typography>Start</Typography>
        </Button>
      )}
      <Dialog open={isStartConfirm} onClose={handleCloseStartConfirm}>
        <DialogTitle>Start the timer?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You can pause whenever you want.
            <br />
            Are you ready?
          </DialogContentText>
          <TextField
            autoFocus
            color="secondary"
            margin="dense"
            id="name"
            label="Minutes"
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">min</InputAdornment>
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
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handleStartTimer()}
          >
            Ready!
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isPauseConfirm} onClose={handleClosePauseConfirm}>
        <DialogTitle>Pause the timer?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You can start whenever you want.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleClosePauseConfirm}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handlePauseTimer()}
          >
            Pause
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isResumeConfirm} onClose={handleCloseResumeConfirm}>
        <DialogTitle>Resume the timer?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You can pause whenever you want.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleCloseResumeConfirm}
          >
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => handlePauseTimer()}
          >
            Resume
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
