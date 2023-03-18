import React, { FC, Fragment, memo, useEffect, useState } from 'react'

import { GrammarlyEditorPlugin } from '@grammarly/editor-sdk-react'
import RateReviewIcon from '@mui/icons-material/RateReview'
import {
  Typography,
  Alert,
  List,
  ListItem,
  IconButton,
  Divider,
  useTheme,
  OutlinedInput,
  FormControl,
  FormHelperText,
  Collapse,
  Button,
  Grid,
  ListItemIcon,
  Box,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Diff from '@/components/diff'
import { correctionService } from '@/services/correctionService'
import { RootState } from '@/store'
import { colors } from '@/themes/globalStyles'
import { CompletedAnswerSentence } from '@/types/model/answer'

type Props = {
  answerSentences: CompletedAnswerSentence[]
  answerId: string
}

export const AnswerArea: FC<Props> = memo(({ answerSentences, answerId }) => {
  const amplifyUser = useSelector((state: RootState) => state.user.amplifyUser)
  const [corrections, setCorrections] = useState<CompletedAnswerSentence[]>([])
  const [correctedSentences, setCorrectedSentences] = useState<
    CompletedAnswerSentence[]
  >([])
  const { t } = useTranslation()
  const [isOpens, setIsOpens] = useState<boolean[]>(
    Array(answerSentences.length).fill(false),
  )
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
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

  const fetchCorrections = async () => {
    correctionService
      .getCorrectionByAnswerId(answerId, amplifyUser)
      .then(({ correctionByAnswerId }) => {
        console.log('correctionByAnswerId', correctionByAnswerId)

        const correctedSentences: CompletedAnswerSentence[] =
          correctionByAnswerId.correctedAnswerSentences

        const newCorrections: CompletedAnswerSentence[] = []
        answerSentences.forEach((answerSentence) => {
          const corrected = correctedSentences.find(
            (c) => c.num === answerSentence.num,
          )

          if (corrected) {
            const c = { ...corrected }
            newCorrections.push(c)
          } else {
            newCorrections.push({
              num: answerSentence.num,
              sentence: answerSentence.sentence,
            })
          }
        })
        setCorrections(newCorrections)

        setCorrectedSentences(correctedSentences)
      })
  }

  useEffect(() => {
    fetchCorrections()
  }, [])

  const onCorrectionChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    num: number,
  ) => {
    setCorrections((current) =>
      current.map((correction) => {
        if (correction.num === num) {
          correction.sentence = event.target.value
        }
        return correction
      }),
    )
  }

  const submitCorrection = (num: number) => {
    const correction = corrections.find((c) => c.num === num)

    if (!correction) {
      return
    }

    setIsUpdating(true)
    correctionService
      .createCorrection(
        answerId,
        correction?.num,
        correction?.sentence,
        amplifyUser,
      )
      .then(() =>
        fetchCorrections().then(() =>
          setIsOpens(Array(answerSentences.length).fill(false)),
        ),
      )
      .finally(() => {
        setIsUpdating(false)
      })
  }

  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ my: 2 }}>
        {t('Answer.review.answerDiffTitle')}
      </Typography>
      <Alert severity="info" sx={{ width: '100%', mb: 1 }}>
        {t('Answer.review.answerDiffInfo')}
      </Alert>
      <div>
        <List dense={false}>
          {answerSentences.map((sentence, i) => (
            <Fragment key={sentence.num}>
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
                <ListItemIcon>{sentence.num}</ListItemIcon>
                <Typography>
                  {sentence.sentence}
                  <br />
                  <Box
                    component="span"
                    sx={{
                      display: 'inline',
                      color: 'gray',
                    }}
                  >
                    {correctedSentences.find((s) => s.num === sentence.num)
                      ?.sentence && (
                      <Diff
                        string1={sentence.sentence}
                        string2={
                          correctedSentences.find((s) => s.num === sentence.num)
                            ?.sentence || ''
                        }
                        mode="words"
                      />
                    )}
                  </Box>
                </Typography>
              </ListItem>
              {!isOpens[i] && <Divider />}
              <Collapse
                in={isOpens[i]}
                timeout="auto"
                unmountOnExit
                sx={{
                  ml: 9,
                  px: 2,
                  pt: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? colors.base.gray
                      : colors.disabled.light,
                }}
              >
                <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                  <GrammarlyEditorPlugin
                    clientId={import.meta.env.GRAMMARLLY_CLIENT_ID}
                  >
                    <OutlinedInput
                      id={sentence.num.toString()}
                      multiline
                      rows={4}
                      fullWidth
                      value={
                        corrections.find((c) => c.num === sentence.num)
                          ?.sentence
                      }
                      onChange={(e) => onCorrectionChange(e, sentence.num)}
                      color="secondary"
                    />
                  </GrammarlyEditorPlugin>
                  <Grid container sx={{ justifyContent: 'space-between' }}>
                    <FormHelperText
                      id="component-helper-text"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      ※ {t('Answer.review.answerDiffHelperText')}
                    </FormHelperText>
                    <FormHelperText
                      id="component-helper-text"
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Button
                        color="secondary"
                        variant={
                          theme.palette.mode === 'dark'
                            ? 'contained'
                            : 'outlined'
                        }
                        size="small"
                        onClick={() => submitCorrection(sentence.num)}
                        disabled={isUpdating}
                      >
                        {t('Answer.review.answerDiffSubmitButton')}
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
