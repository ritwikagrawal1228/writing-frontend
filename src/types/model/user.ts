import { UserPlan } from '@/constants/UserPlans'
import { UserType } from '@/constants/UserType'

export type User = {
  id: string
  name: string
  plan: UserPlan
  email: string
  userType: UserType
  isAdmin: boolean
  profileImageKey: string
  studyTarget: string
  introduction: string
  subscriptionExpiresAt: string
  isSubscribeEmail: boolean
  isSubscribePush: boolean
}
