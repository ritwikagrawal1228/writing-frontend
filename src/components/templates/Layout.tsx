import React, { FC, Fragment, useEffect, useState } from 'react'

import i18next from 'i18next'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MenuIcon from '@mui/icons-material/Menu'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import SettingsIcon from '@mui/icons-material/Settings'
import TranslateIcon from '@mui/icons-material/Translate'
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import { useSelector, useDispatch } from 'react-redux'

import { ProfileAvatar } from '../parts/common/ProfileAvatar'

import { ColorModeContext } from '@/context/ColorMode'
import { RootState } from '@/store'
import { commonSlice } from '@/store/common'
import { colors } from '@/themes/globalStyles'
import { useTranslation } from 'react-i18next'
import { Path } from '@/constants/Path'
import { UserPlanFree } from '@/constants/UserPlans'
import { Outlet } from 'react-router-dom'
import { Link, useNavigate } from 'react-router-dom'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { Lang, langSlice } from '@/store/i18n'
import { colorModeSlice } from '@/store/colorMode'

const langMenuItems = [
  { label: 'English', value: 'en' as Lang },
  { label: '日本語', value: 'ja' as Lang },
]

const Layout: FC = () => {
  const { t } = useTranslation()
  const { user } = useGetAuthUser()
  const lang = useSelector((state: RootState) => state.lang.lang)
  const problemMenuItems = { label: t('Nav.menu.problem'), href: Path.Problem }
  const upgradeMenuItems = {
    label: t('Nav.menu.upgrade'),
    href: Path.PaymentSubscription,
  }
  const descriptorItems = {
    label: t('Nav.menu.descriptors'),
    href: Path.Descriptors,
  }
  const navigate = useNavigate()
  const { signOut } = useAuthenticator()
  const dispatch = useDispatch()

  const snackBarState = useSelector(
    (state: RootState) => state.common.snackBarState,
  )
  const isBackdropShow = useSelector(
    (state: RootState) => state.common.isBackdropShow,
  )
  const dialogState = useSelector(
    (state: RootState) => state.common.dialogState,
  )
  const handleClose = (result?: boolean) => {
    if (result !== undefined) {
      dialogState.onAction(result)
    }
    dispatch(commonSlice.actions.closeDialog())
  }
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const [open, setOpen] = React.useState(false)
  const [menus, setMenus] = React.useState([problemMenuItems, descriptorItems])
  const colorMode = useSelector((state: RootState) => state.colorMode.colorMode)
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.breadcrumbs,
  )

  useEffect(() => {
    if (!user) {
      return
    }

    if (user.plan === UserPlanFree) {
      setMenus([problemMenuItems, descriptorItems, upgradeMenuItems])
    }
  }, [user, lang])

  const settings = [
    {
      key: 'profileSetting',
      text: t('Nav.profileMenu.profile'),
      type: 'text',
      icon: <SettingsIcon />,
    },
    {
      key: 'language',
      text: t('Nav.profileMenu.language'),
      type: 'collapse',
      icon: <TranslateIcon />,
      children: langMenuItems,
    },
    {
      key: 'colorMode',
      text: t('Nav.profileMenu.colorMode'),
      type: 'text',
      icon: <Brightness4Icon />,
    },
    {
      key: 'signOut',
      text: t('Nav.profileMenu.signOut'),
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
    navigate(href)
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = (menu: string) => {
    switch (menu) {
      case 'profileSetting':
        navigate(Path.ProfileSettings)
        break
      case 'signOut':
        signOut()
        break
      case 'colorMode':
        dispatch(
          colorModeSlice.actions.updateColorMode(
            colorMode === 'light' ? 'dark' : 'light',
          ),
        )
        break

      default:
        break
    }

    setAnchorElUser(null)
  }

  const handleCloseLangMenu = (lang: Lang) => {
    dispatch(langSlice.actions.updateLang(lang))
    setOpen(false)
  }

  return (
    <>
      <AppBar position="static" color="default">
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              paddingLeft: '0 !important',
              paddingRight: '0 !important',
            }}
          >
            <img src="/logo.png" height={20} width={32.36} alt="logo" />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={Path.Problem}
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
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? colors.base.gray
              : colors.disabled.light,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs?.map((b, i) =>
              b.href ? (
                <Link to={b.href} key={i}>
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
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? theme.palette.background.paper
              : theme.palette.background.default,
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Container maxWidth="lg" sx={{ pt: '30px' }}>
          <Outlet />
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
      <Dialog
        open={dialogState.isDialogShow}
        onClose={() => handleClose(undefined)}
      >
        <DialogTitle>{dialogState.titleText}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {dialogState.contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => handleClose(true)}>
            {dialogState.actionText}
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => handleClose(false)}
          >
            {dialogState.cancelText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Layout
