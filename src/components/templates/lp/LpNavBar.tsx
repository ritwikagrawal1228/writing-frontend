import * as React from 'react'

import TranslateIcon from '@mui/icons-material/Translate'
import { Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import i18next from 'i18next'

import { Path } from '@/constants/Path'
import { fontSizes } from '@/themes/globalStyles'

const languages = {
  en: 'English',
  ja: '日本語',
}

export default function LpNavBar() {
  const [langs] = React.useState<Record<string, string>>(languages)

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const toggleLang = (lang: string) => {
    if (lang === i18next.language) {
      return
    }
    // TODO: ここで言語を切り替える
    setAnchorElUser(null)
  }

  return (
    <>
      <AppBar color="default" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <img src="/logo.png" height={30} width={48.54} alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={Path.Problem}
              sx={{
                mr: 10,
                ml: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 'bold',
                textDecoration: 'none',
                flexGrow: { sx: 1 },
              }}
            >
              IELTS Writing Helper
            </Typography>

            <Box sx={{ flexGrow: 0, mr: 5 }}>
              <Tooltip
                title={
                  i18next.language === 'ja' ? '言語変更' : 'Change language'
                }
              >
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <TranslateIcon />
                  <Typography
                    variant="caption"
                    fontSize={fontSizes.m}
                    sx={{ ml: 1 }}
                  >
                    {languages[i18next.language as keyof typeof languages]}
                  </Typography>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {Object.keys(langs).map((lang) => (
                  <MenuItem
                    disabled={i18next.language === lang}
                    key={lang}
                    onClick={() => toggleLang(lang)}
                  >
                    <Typography textAlign="center">{langs[lang]}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}
