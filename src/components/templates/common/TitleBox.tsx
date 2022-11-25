import React, { FC, memo, ReactNode } from 'react'

import InfoIcon from '@mui/icons-material/Info'
import { Box, Typography, Alert } from '@mui/material'

import { fontSizes, spaces } from '@/themes/globalStyles'

type Props = {
  title: string | ReactNode
  children: ReactNode
  guide?: string
}

export const TitleBox: FC<Props> = memo(({ title, children, guide }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: spaces.s,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <Typography fontSize={fontSizes.xxl} fontWeight="bold">
          {title}
        </Typography>
        {guide && (
          <Alert
            severity="error"
            icon={<InfoIcon fontSize="inherit" sx={{ color: '#F2901F' }} />}
            sx={{
              fontSize: fontSizes.s,
              paddingY: 0,
              marginLeft: 2,
            }}
          >
            {guide}
          </Alert>
        )}
      </Box>
      {children}
    </Box>
  )
})

TitleBox.displayName = 'TitleBox'
