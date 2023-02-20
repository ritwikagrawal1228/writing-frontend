import { useEffect, useState } from 'react'

import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'
import { User } from '@/types/model/user'

export const useProfileSettingDefaultFrom = (user?: User) => {
  const [profileSettingForm, setProfileSettingForm] =
    useState<UpdateProfileSettingForm>()

  useEffect(() => {
    if (user) {
      setProfileSettingForm({
        name: user.name,
        email: user.email,
        introduction: user.introduction,
        studyTarget: Number(user.studyTarget || 0) || 0,
        profileImageKey: user.profileImageKey,
      })
    }
  }, [user])

  return {
    profileSettingForm,
  }
}
