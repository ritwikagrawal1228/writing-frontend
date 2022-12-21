import React, { FC, Fragment, memo } from 'react'

import RateReviewIcon from '@mui/icons-material/RateReview'
import {
  Typography,
  Alert,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Divider,
  Popper,
  Box,
  useTheme,
  TextField,
} from '@mui/material'

import { colors } from '@/themes/globalStyles'
import { CompletedAnswerSentence } from '@/types/model/answer'

type Props = {
  answerSentences: CompletedAnswerSentence[]
}

export const AnswerArea: FC<Props> = memo(({ answerSentences }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const theme = useTheme()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        Answer
      </Typography>
      <Alert severity="info" sx={{ width: '100%', mb: 1 }}>
        Select the text you want to review
        <br /> and click the <RateReviewIcon
          color="primary"
          fontSize="small"
        />{' '}
        button to review.
      </Alert>
      <div>
        <List dense={false}>
          {answerSentences.map((answerSentence) => (
            <Fragment key={answerSentence.num}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleClick}
                  >
                    <RateReviewIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={answerSentence.sentence} />
              </ListItem>
              <Divider />
              <Popper
                id={answerSentence.num + answerSentence.sentence}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                sx={{ width: '515px' }}
              >
                <Box
                  sx={{
                    border: 1,
                    p: 1,
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? colors.base.gray
                        : colors.disabled.light,
                    color: theme.palette.text.primary,
                    my: 1,
                  }}
                >
                  <TextField
                    id=""
                    label=""
                    color="secondary"
                    multiline
                    rows={4}
                    fullWidth
                  />
                </Box>
              </Popper>
            </Fragment>
          ))}
        </List>
      </div>
    </>
  )
})

AnswerArea.displayName = 'AnswerArea'
