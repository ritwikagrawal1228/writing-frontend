import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, {
  createContext,
  FC,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import MenuIcon from '@mui/icons-material/Menu'
import TranslateIcon from '@mui/icons-material/Translate'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  createTheme,
  CssBaseline,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  PaletteMode,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'
import { getDesignTokens } from '@/themes/defaultTheme'
import { colors } from '@/themes/globalStyles'
import { stringAvatar } from '@/utils/avator'

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
const langMenuItems = [
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
]
const settings = [
  {
    key: 'profileSetting',
    text: 'Profile Settings',
    type: 'text',
    icon: <ManageAccountsIcon />,
  },
  {
    key: 'language',
    text: 'Language',
    type: 'collapse',
    icon: <TranslateIcon />,
    children: langMenuItems,
  },
  {
    key: 'colorMode',
    text: 'Switch Color Mode',
    type: 'text',
    icon: <Brightness4Icon />,
  },
  {
    key: 'signOut',
    text: 'Sign Out',
    type: 'text',
    icon: <ExitToAppIcon />,
  },
]

const Layout: FC<LayoutProps> = ({ children, title, description }) => {
  const [mode, setMode] = useState<PaletteMode>('light')
  const [langs, setLangs] = React.useState<Record<string, string>>(languages)
  const t = useTranslations('Nav')
  const router = useRouter()
  const { user, signOut } = useAuthenticator((context) => [context.user])
  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  useEffect(() => {
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
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )
  const [open, setOpen] = React.useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = (menu: string) => {
    switch (menu) {
      case 'profileSetting':
        router.push(Path.ProfileSettings)
        break
      case 'signOut':
        signOut()
        router.push(Path.Auth)
        break
      case 'colorMode':
        colorMode.toggleColorMode()
        break

      default:
        break
    }

    setAnchorElUser(null)
  }

  const handleCloseLangMenu = (lang: string) => {
    router.push(router.pathname, router.route, {
      locale: lang,
    })
    setOpen(false)
  }

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" color="secondary" elevation={2}>
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
                      color="inherit"
                      sx={{ display: 'block' }}
                    >
                      {page}
                    </Button>
                  ))}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {user?.attributes?.name ? (
                        <Avatar
                          {...stringAvatar(
                            user?.attributes?.name || 'User Name',
                          )}
                        />
                      ) : (
                        <Avatar />
                      )}
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
                    <List
                      sx={{
                        width: '100%',
                        maxWidth: 360,
                        bgcolor: 'background.paper',
                      }}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                    >
                      {settings.map((setting) => {
                        return (
                          <Fragment key={setting.key}>
                            {setting.type === 'text' ? (
                              <ListItemButton
                                onClick={() => handleCloseUserMenu(setting.key)}
                              >
                                <ListItemIcon>{setting.icon}</ListItemIcon>
                                <ListItemText primary={setting.text} />
                              </ListItemButton>
                            ) : (
                              <Fragment key={setting.key}>
                                <ListItemButton onClick={handleClick}>
                                  <ListItemIcon>{setting.icon}</ListItemIcon>
                                  <ListItemText primary={setting.text} />
                                  {open ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <List component="div" disablePadding>
                                    {setting.children?.map((child) => (
                                      <Fragment key={child.value}>
                                        <ListItemButton
                                          sx={{ pl: 4 }}
                                          onClick={() =>
                                            handleCloseLangMenu(child.value)
                                          }
                                        >
                                          <ListItemIcon></ListItemIcon>
                                          <ListItemText primary={child.label} />
                                        </ListItemButton>
                                      </Fragment>
                                    ))}
                                  </List>
                                </Collapse>
                              </Fragment>
                            )}
                          </Fragment>
                        )
                      })}
                    </List>
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
              backgroundColor:
                mode === 'dark' ? colors.base.lightGray : colors.bg.highlighted,
            }}
          >
            {children}
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}

export default Layout
