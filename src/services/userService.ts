import { gql } from 'graphql-request'

import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'
import { AmplifyUser } from '@/types/model/amplifyUser'
import { User } from '@/types/model/user'
import { getGraphQLClient } from '@/utils/graphqlClient'

const updateProfile = async (
  form: UpdateProfileSettingForm,
  user?: AmplifyUser,
) => {
  const query = gql`
    mutation ($input: UpdateUserProfileInput!) {
      updateUserProfile(input: $input) {
        id
        name
        plan
        email
        userType
        isAdmin
        profileImageKey
        studyTarget
        introduction
        isSubscribeEmail
        isSubscribePush
        subscriptionExpiresAt
      }
    }
  `

  const variables = {
    input: {
      email: form.email,
      name: form.name,
      studyTarget: String(form.studyTarget),
      introduction: form.introduction,
      profileImageKey: form.profileImageKey,
    },
  }

  return await getGraphQLClient(user).request<{ updateUserProfile: User }>(
    query,
    variables,
  )
}

const userQuery = gql`
  query ($userId: ID!) {
    user(userId: $userId) {
      id
      name
      plan
      email
      userType
      isAdmin
      profileImageKey
      studyTarget
      introduction
      isSubscribeEmail
      isSubscribePush
      subscriptionExpiresAt
    }
  }
`
const getAuthUser = async (user: AmplifyUser) => {
  return await getGraphQLClient(user)
    .request<{ user: User }>(userQuery, { userId: user.attributes.sub })
    .then((res) => res)
}

export const userService = {
  updateProfile,
  getAuthUser,
}
