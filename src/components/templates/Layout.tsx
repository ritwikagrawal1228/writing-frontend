import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { FC, Fragment } from 'react'

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
  CssBaseline,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'
import { ColorModeContext } from '@/context/ColorMode'
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
  const [langs, setLangs] = React.useState<Record<string, string>>(languages)
  const t = useTranslations('Nav')
  const router = useRouter()
  const { user, signOut } = useAuthenticator((context) => [context.user])
  const theme = useTheme()
  const colorMode = React.useContext(ColorModeContext)

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

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <CssBaseline />
      <AppBar position="static" color="secondary">
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              paddingLeft: '0 !important',
              paddingRight: '0 !important',
            }}
          >
            <Image src="/logo.png" height={20} width={32.36} alt="logo" />
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
                      {...stringAvatar(user?.attributes?.name || 'User Name')}
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
                            <Collapse in={open} timeout="auto" unmountOnExit>
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
        sx={{
          height: 30,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? colors.base.gray
              : colors.disabled.light,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg">
          <Typography fontSize={12} sx={{ lineHeight: '30px' }}>
            Problem list
          </Typography>
        </Container>
      </Box>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: '30px' }}>
          {children}
        </Container>
      </Box>
    </>
  )
}

export default Layout
