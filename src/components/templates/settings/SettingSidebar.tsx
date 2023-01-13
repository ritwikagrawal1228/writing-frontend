import { useRouter } from 'next/router'
import React, { Fragment, memo } from 'react'

import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PaymentIcon from '@mui/icons-material/Payment'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material'

import { Path } from '@/constants/Path'

const settingList = [
  {
    label: 'Profile Setting',
    icon: <ManageAccountsIcon />,
    path: Path.ProfileSettings,
  },
  {
    label: 'Notification Setting',
    icon: <NotificationsActiveIcon />,
    path: Path.NotificationSettings,
  },
  {
    label: 'Payment Setting',
    icon: <PaymentIcon />,
    path: Path.PaymentSettings,
  },
]

export const SettingSidebar = memo(() => {
  const [selectedIndex, setSelectedIndex] = React.useState(1)
  const router = useRouter()

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
