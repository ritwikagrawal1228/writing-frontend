import { ProblemType1, ProblemType2 } from '@/constants/ProblemType'
import { Answer } from '@/types/model/answer'
import { User } from '@/types/model/user'

export type TaskType = typeof ProblemType1 | typeof ProblemType2

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
