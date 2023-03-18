import React, { Fragment, memo } from 'react'

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PaymentIcon from '@mui/icons-material/Payment'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'

import { Path } from '@/constants/Path'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const SettingSidebar = memo(() => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const settingList = [
    {
      label: t('Setting.sidebar.labelProfile'),
      icon: <ManageAccountsIcon />,
      path: Path.ProfileSettings,
    },
    // {
    //   label: t('sidebar.labelNotification'),
    //   icon: <NotificationsActiveIcon />,
    //   path: Path.NotificationSettings,
    // },
    {
      label: t('Setting.sidebar.labelPayment'),
      icon: <PaymentIcon />,
      path: Path.PaymentSettings,
    },
  ]

  const movePage = (path: string) => {
    navigate(path)
  }

  return (
    <>
      <Paper sx={{ minHeight: 200 }}>
        <List component="nav">
          {settingList.map((item, index) => (
            <Fragment key={index}>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => movePage(item.path)}
                disabled={Path.NotificationSettings === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Fragment>
          ))}
        </List>
      </Paper>
    </>
  )
})

SettingSidebar.displayName = 'SettingSidebar'
