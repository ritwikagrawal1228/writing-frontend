import { gql } from 'graphql-request'

import { Path } from '@/constants/Path'
import { UpdateProfileSettingForm } from '@/types/form/ProfileSettingForm'
import { User } from '@/types/model/user'
import { axios } from '@/utils/axios'
import { getGraphQLClient } from '@/utils/graphqlClient'

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
        profileImageKey
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
      profileImageKey: form.profileImageKey,
    },
  }

  return await axios.post(Path.APIGraphql, {
    query,
    variables,
  })
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
    }
  }
`

const getAuthUser = async () => {
  return axios.post<{ user: User }>(Path.APIGraphql, {
    query: userQuery,
    variables: undefined,
  })
}

const getAuthUserFromServer = async (user: any) => {
  const client = getGraphQLClient(user)

  return await client
    .request<{ user: User }>(userQuery, { userId: user.attributes.sub })
    .then((res) => res)
}

export const userService = {
  updateProfile,
  getAuthUser,
  getAuthUserFromServer,
}
