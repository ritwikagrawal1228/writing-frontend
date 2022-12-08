import { Answer } from '@/types/model/answer'
import { User } from '@/types/model/user'

export type TaskType = 'Type_#Task1' | 'Type_#Task2'

export type Problem = {
  id: string
  title: string
  question: string
  questionImageKey: string
  taskType: TaskType
  createdAt: string
  updatedAt: string
  user: User
  answers: Answer[]
}
