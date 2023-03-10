import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, Fragment, useEffect, useState } from 'react'

import { useAuthenticator } from '@aws-amplify/ui-react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

import { Path } from '@/constants/Path'

import SettingsIcon from '@mui/icons-material/Settings'

import { UserPlanFree } from '@/constants/UserPlans'

import TranslateIcon from '@mui/icons-material/Translate'

import { ColorModeContext } from '@/context/ColorMode'

import {
  Alert,
  AppBar,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
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
  Snackbar,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'

import { RootState } from '@/store'

import { useTranslations } from 'next-intl'

import { commonSlice } from '@/store/common'

import { useSelector, useDispatch } from 'react-redux'

import { colors } from '@/themes/globalStyles'

import { ProfileAvatar } from '../parts/common/ProfileAvatar'

type LayoutProps = {
  title: string
  description?: string
  children: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

const languages = {
  en: 'English',
  ja: '日本語',
}

const langMenuItems = [
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
]

const Layout: FC<LayoutProps> = ({
  children,
  title,
  description,
  breadcrumbs,
}) => {
  const t = useTranslations('Nav')
  const problemMenuItems = { label: t('menu.problem'), href: Path.Problem }
  const upgradeMenuItems = {
    label: t('menu.upgrade'),
    href: Path.PaymentSubscription,
  }
  const descriptorItems = {
    label: t('menu.descriptors'),
    href: Path.Descriptors,
  }
  const router = useRouter()
  const { signOut } = useAuthenticator()
  const theme = useTheme()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.user)

  const colorMode = React.useContext(ColorModeContext)
  const snackBarState = useSelector(
    (state: RootState) => state.common.snackBarState,
  )
  const isBackdropShow = useSelector(
    (state: RootState) => state.common.isBackdropShow,
  )
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [open, setOpen] = React.useState(false)
  const [menus, setMenus] = React.useState([problemMenuItems, descriptorItems])

  useEffect(() => {
    if (!user) {
      return
    }

    if (user.plan === UserPlanFree) {
      setMenus([problemMenuItems, descriptorItems, upgradeMenuItems])
    }
  }, [user])

  const settings = [
    {
      key: 'profileSetting',
      text: t('profileMenu.profile'),
      type: 'text',
      icon: <SettingsIcon />,
    },
    {
      key: 'language',
      text: t('profileMenu.language'),
      type: 'collapse',
      icon: <TranslateIcon />,
      children: langMenuItems,
    },
    {
      key: 'colorMode',
      text: t('profileMenu.colorMode'),
      type: 'text',
      icon: <Brightness4Icon />,
    },
    {
      key: 'signOut',
      text: t('profileMenu.signOut'),
      type: 'text',
      icon: <ExitToAppIcon />,
    },
  ]

  const handleClick = () => {
    setOpen(!open)
  }

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (href: string) => {
    router.push(href)
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
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale: lang },
    )
    setOpen(false)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <CssBaseline />
      <AppBar position="static" color="default">
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
                mr: 5,
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
                {menus.map((menu) => (
                  <MenuItem
                    key={menu.label}
                    color="primary"
                    onClick={() => handleCloseNavMenu(menu.href)}
                  >
                    <Typography textAlign="center">{menu.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menus.map((menu) => (
                <Button
                  key={menu.label}
                  onClick={() => handleCloseNavMenu(menu.href)}
                  color="inherit"
                  sx={{ display: 'block' }}
                  variant="text"
                >
                  {menu.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <ProfileAvatar user={user} />
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
          height: 35,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? colors.base.gray
              : colors.disabled.light,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs?.map((b, i) =>
              b.href ? (
                <Link href={b.href} key={i}>
                  <Typography
                    sx={{ lineHeight: '35px', textDecoration: 'underline' }}
                    color="link"
                    fontSize="16px"
                  >
                    {b.label}
                  </Typography>
                </Link>
              ) : (
                <Typography fontSize="16px" key={i} sx={{ lineHeight: '35px' }}>
                  {b.label}
                </Typography>
              ),
            )}
          </Breadcrumbs>
        </Container>
      </Box>
      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: '30px' }}>
          {children}
        </Container>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdropShow}
        onClick={() =>
          dispatch(commonSlice.actions.updateIsBackdropShow(false))
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {snackBarState.isSnackbarShow && (
        <Snackbar
          open={snackBarState.isSnackbarShow}
          autoHideDuration={6000}
          onClose={(event?: React.SyntheticEvent | Event, reason?: string) =>
            reason === 'clickaway' && dispatch(commonSlice.actions.reset())
          }
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={snackBarState.snackBarType}
            onClose={(event?: React.SyntheticEvent | Event, reason?: string) =>
              reason === 'clickaway' && dispatch(commonSlice.actions.reset())
            }
            sx={{ width: '100%' }}
          >
            {snackBarState.snackBarMsg}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default Layout
