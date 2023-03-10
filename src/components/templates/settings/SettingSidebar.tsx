import { useRouter } from 'next/router'
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
import { useTranslations } from 'next-intl'

import { Path } from '@/constants/Path'

export const SettingSidebar = memo(() => {
  const router = useRouter()
  const t = useTranslations('Setting')
  const settingList = [
    {
      label: t('sidebar.labelProfile'),
      icon: <ManageAccountsIcon />,
      path: Path.ProfileSettings,
    },
    // {
    //   label: t('sidebar.labelNotification'),
    //   icon: <NotificationsActiveIcon />,
    //   path: Path.NotificationSettings,
    // },
    {
      label: t('sidebar.labelPayment'),
      icon: <PaymentIcon />,
      path: Path.PaymentSettings,
    },
  ]

  const movePage = (path: string) => {
    router.push(path)
  }

  return (
    <>
      <Paper sx={{ minHeight: 200 }}>
        <List component="nav">
          {settingList.map((item, index) => (
            <Fragment key={index}>
              <ListItemButton
                selected={router.pathname === item.path}
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
