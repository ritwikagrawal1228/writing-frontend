import React, { FC, memo, useEffect, useState } from 'react'

import { Avatar } from '@mui/material'
import { Storage } from 'aws-amplify'

import { User } from '@/types/model/user'
import { stringAvatar } from '@/utils/avatar'

type Props = {
  user?: User
}

export const ProfileAvatar: FC<Props> = memo(({ user }) => {
  const [avatarImg, setAvatarImg] = useState<string>('')

  useEffect(() => {
    if (!user) {
      return
    }
    Storage.get(user.profileImageKey)
      .then((res) => {
        setAvatarImg(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [user?.profileImageKey])

  return (
    <>
      {avatarImg ? (
        <Avatar src={avatarImg}></Avatar>
      ) : user?.name ? (
        <Avatar {...stringAvatar(user?.name || 'E I')} />
      ) : (
        <Avatar />
      )}
    </>
  )
})

ProfileAvatar.displayName = 'ProfileAvatar'
