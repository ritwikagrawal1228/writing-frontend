import React, { FC, Fragment, memo, useEffect, useState } from 'react'

import RateReviewIcon from '@mui/icons-material/RateReview'
import SendIcon from '@mui/icons-material/Send'
import {
  Typography,
  Alert,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Divider,
  useTheme,
  OutlinedInput,
  FormControl,
  FormHelperText,
  Collapse,
  Button,
  Grid,
  ListItemIcon,
} from '@mui/material'

import { correctionService } from '@/services/correctionService'
import { colors } from '@/themes/globalStyles'
import { CompletedAnswerSentence } from '@/types/model/answer'

type Props = {
  answerSentences: CompletedAnswerSentence[]
  answerId: string
}

export const AnswerArea: FC<Props> = memo(({ answerSentences, answerId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [corrections, setCorrections] = useState<CompletedAnswerSentence[]>([])
  const [isOpens, setIsOpens] = useState<boolean[]>(
    Array(answerSentences.length).fill(false),
  )
  const theme = useTheme()

  const handleClick = (i: number) => {
    // Set isOpens
    const newIsOpens = isOpens.map((isOpen, index) => {
      if (index === i) {
        return !isOpen
      }
      return isOpen
    })
    setIsOpens(newIsOpens)
  }

  useEffect(() => {
    setCorrections(answerSentences)
  }, [answerSentences])

  useEffect(() => {
    console.log('corrections', corrections)
  }, [corrections])

  useEffect(() => {
    console.log('isOpens', isOpens)
  }, [isOpens])

  const onCorrectionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    num: number,
  ) => {
    const newCorrections = corrections.map((correction) => {
      if (correction.num === num) {
        correction.sentence = event.target.value
      }
      return correction
    })
    setCorrections(newCorrections)
  }

  const submitCorrection = (num: number) => {
    const correction = corrections.find((c) => c.num === num)

    if (!correction) {
      return
    }

    correctionService.createCorrection(
      answerId,
      correction?.num,
      correction?.sentence,
    )
  }

  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Answer
      </Typography>
      <Alert severity="info" sx={{ width: '100%', mb: 1 }}>
        Click the <RateReviewIcon fontSize="small" /> button to add corrections.
      </Alert>
      <div>
        <List dense={false}>
          {corrections.map((correction, i) => (
            <Fragment key={correction.num}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleClick(i)}
                  >
                    <RateReviewIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>{correction.num}</ListItemIcon>
                <ListItemText
                  primary={
                    answerSentences.find((s) => s.num === correction.num)
                      ?.sentence
                  }
                />
              </ListItem>
              {!isOpens[i] && <Divider />}
              <Collapse
                in={isOpens[i]}
                timeout="auto"
                unmountOnExit
                sx={{
                  px: 2,
                  pt: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? colors.base.gray
                      : colors.disabled.light,
                }}
              >
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                  <OutlinedInput
                    id={correction.num.toString()}
                    multiline
                    rows={4}
                    fullWidth
                    value={correction.sentence}
                    onChange={(e) => onCorrectionChange(e, correction.num)}
                    color="secondary"
                  />
                  <Grid container sx={{ justifyContent: 'space-between' }}>
                    <FormHelperText
                      id="component-helper-text"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      ※ Just enter the correct sentence to show the diff
                    </FormHelperText>
                    <FormHelperText
                      id="component-helper-text"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Button
                        startIcon={<SendIcon />}
                        color="secondary"
                        variant={
                          theme.palette.mode === 'dark'
                            ? 'contained'
                            : 'outlined'
                        }
                        size="small"
                        sx={{ ml: 3 }}
                        onClick={() => submitCorrection(correction.num)}
                      >
                        Submit
                      </Button>
                    </FormHelperText>
                  </Grid>
                </FormControl>
              </Collapse>
            </Fragment>
          ))}
        </List>
      </div>
    </>
  )
})

AnswerArea.displayName = 'AnswerArea'
