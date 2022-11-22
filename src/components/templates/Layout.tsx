import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, {
  createContext,
  FC,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import MenuIcon from '@mui/icons-material/Menu'
import TranslateIcon from '@mui/icons-material/Translate'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  PaletteMode,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import { colors, fontSizes } from '@/themes/globalStyles'

const drawerWidth = 220

type LayoutProps = {
  title: string
  description?: string
  children: React.ReactNode
}

const languages = {
  en: 'English',
  ja: '日本語',
}

const ColorModeContext = createContext({
  toggleColorMode: () => {
    //
  },
})

const pages = ['Problems', 'Tips']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const Layout: FC<LayoutProps> = ({ children, title, description }) => {
  const [mode, setMode] = useState<PaletteMode>('light')
  const [langs, setLangs] = React.useState<Record<string, string>>(languages)
  const t = useTranslations('Menu')
  const router = useRouter()

  useLayoutEffect(() => {
    setMode(() => {
      const prevMode = localStorage.getItem('theme')
      if (prevMode !== null) {
        return prevMode as PaletteMode
      }

      const machineMode =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

      localStorage.setItem('theme', machineMode)

      return machineMode
    })
  }, [])

  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', newMode)
          localStorage.setItem('theme', newMode)

          return newMode
        })
      },
    }),
    [],
  )

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElLang, setAnchorElLang] = React.useState<null | HTMLElement>(
    null,
  )
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )

  // Update the theme only if the mode changes
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = (lang: string) => {
    setAnchorElUser(null)
  }
  const handleCloseLangMenu = (lang: string) => {
    router.push(router.pathname, router.route, {
      locale: router.locales
        ? router.locales.filter((l) => l !== router.locale).join()
        : 'en',
    })
    setAnchorElLang(null)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"
        />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <CssBaseline />
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
                  <IconButton onClick={handleOpenLangMenu} sx={{ p: 0 }}>
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
                  anchorEl={anchorElLang}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElLang)}
                  onClose={handleCloseLangMenu}
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
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
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
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => handleCloseUserMenu('')}
                    >
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            paddingLeft: { sm: `${drawerWidth}px` },
            pt: { sm: 8, xs: 7 },
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </ColorModeContext.Provider>
    </>
  )
}

export default Layout
