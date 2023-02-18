import { User } from '@/types/model/user'

export type Review = {
  id: string
  content: string
  userId: string
  user?: User
}
