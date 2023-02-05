import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'
import { axios } from '@/utils/axios'

const updateProfile = async (form: UpdateProfileSettingForm) => {
  const query = gql`
    mutation ($input: UpdateUserProfileInput!) {
      updateUserProfile(input: $input) {
        id
        name
        plan
        email
        userType
        isAdmin
        profileImageUrl
        studyTarget
        introduction
        isSubscribeEmail
        isSubscribePush
      }
    }
  `

  const variables = {
    input: {
      email: form.email,
      name: form.name,
      studyTarget: String(form.studyTarget),
      introduction: form.introduction,
      profileImageUrl: form.profileImageUrl,
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
}

export const userService = {
  updateProfile,
}
