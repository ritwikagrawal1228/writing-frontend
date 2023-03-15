import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'

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

import { fontSizes } from '@/themes/globalStyles'

const languages = {
  en: 'English',
  ja: '日本語',
}

type Props = {
  isOnlyLogo?: boolean
}

export default function LpNavBar({ isOnlyLogo = false }: Props) {
  const router = useRouter()
  const [langs, setLangs] = React.useState<Record<string, string>>(languages)
  const t = useTranslations('LP')
  const pages = [
    { label: t('menu.feature'), top: 1000 },
    { label: t('menu.pricing'), top: 2500 },
  ]

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

  const scroll = (top: number) => {
    window.scrollTo({
      top,
      behavior: 'smooth',
    })
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = (lang: string) => {
    setAnchorElUser(null)
  }
  const toggleLang = (lang: string) => {
    if (lang === router.locale) {
      return
    }
    router.push(router.pathname, router.route, {
      locale: router.locales
        ? router.locales.filter((l) => l !== router.locale).join()
        : 'en',
    })
    setAnchorElUser(null)
  }

  return (
    <>
      <AppBar position="fixed" color="default" elevation={0}>
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
                flexGrow: { sx: 1 },
              }}
            >
              IELTS Writing Helper
            </Typography>

            {!isOnlyLogo && (
              <>
                <Box
                  sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                ></Box>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  {pages.map((page) => (
                    <Button
                      key={page.label}
                      onClick={() => scroll(page.top)}
                      color="inherit"
                      variant="text"
                      sx={{ display: 'block' }}
                    >
                      {page.label}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flexGrow: 0, mr: 5 }}>
                  <Tooltip title={t('menu.langTooltip')}>
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
                        disabled={router.locale === lang}
                        key={lang}
                        onClick={() => toggleLang(lang)}
                      >
                        <Typography textAlign="center">
                          {langs[lang]}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </>
            )}
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
