import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import MenuIcon from '@mui/icons-material/Menu'
import TranslateIcon from '@mui/icons-material/Translate'
import { Tooltip } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTranslations } from 'next-intl'

import { colors, fontSizes } from '@/themes/globalStyles'

const pages = ['Products', 'Pricing', 'Blog']
const languages = {
  en: 'English',
  ja: '日本語',
}

export default function LpNavBar() {
  const router = useRouter()
  const [langs, setLangs] = React.useState<Record<string, string>>(languages)
  const t = useTranslations('LP')

  const signInWithProvider = () => {
    return
  }

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = (lang: string) => {
    router.push(router.pathname, router.route, {
      locale: router.locales
        ? router.locales.filter((l) => l !== router.locale).join()
        : 'en',
    })
    setAnchorElUser(null)
  }

  return (
    <>
      <AppBar position="static" color="secondary">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Image src="/logo.png" height={30} width={48.54} alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 10,
                ml: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              IELTS Writing Helper
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                color="primary"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    color="primary"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ color: colors.base.black, display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0, mr: 5 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <TranslateIcon />
                  <Typography
                    variant="caption"
                    fontSize={fontSizes.m}
                    sx={{ ml: 1 }}
                  >
                    {languages[router.locale as keyof typeof languages]}
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
                    key={lang}
                    onClick={() => handleCloseUserMenu(lang)}
                  >
                    <Typography textAlign="center">{langs[lang]}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Button
              variant="contained"
              endIcon={<DoubleArrowIcon />}
              onClick={signInWithProvider}
            >
              <b>Start Now</b>
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const { locale } = context
  return {
    props: { messages: require(`@/locales/${locale}.json`) },
  }
}
