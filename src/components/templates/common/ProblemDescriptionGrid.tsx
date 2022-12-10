import React, { FC, memo } from 'react'

import { Grid, Paper, Typography } from '@mui/material'

import { Problem } from '@/types/model/problem'

type Props = {
  problem: Problem
}

export const ProblemDescriptionGrid: FC<Props> = memo(({ problem }) => {
  return (
    <>
      <Grid container alignItems="center" sx={{ my: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight="bold" sx={{ pb: 2 }}>
              {problem.taskType === 'Type_#Task1' ? 'Part1' : 'Part2'}
            </Typography>
            <Typography>
              You should spend about{' '}
              {problem.taskType === 'Type_#Task1' ? 20 : 40} minutes on this
              task. Write {problem.taskType === 'Type_#Task1' ? 150 : 250}{' '}
              words.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  )
})

ProblemDescriptionGrid.displayName = 'ProblemDescriptionGrid'
