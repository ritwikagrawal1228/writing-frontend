import React, { FC, memo } from 'react'

import { Box, Typography } from '@mui/material'

import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
  img?: string
}

export const ProblemDisplayPaper: FC<Props> = memo(({ problem, img }) => {
  return (
    <>
      <Box
        sx={{
          p: 3,
          width: '100%',
        }}
      >
        <Typography
          sx={{ ml: 3, mt: 1, wordWrap: 'break-word' }}
          fontWeight="bold"
        >
          {problem.question}
        </Typography>
      </Box>
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ mt: 1 }}>
          <img
            src={img}
            style={{
              width: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Box>
    </>
  )
})

ProblemDisplayPaper.displayName = 'ProblemDisplayPaper'
