import { Problem } from '@/types/model/problem'

export type Answer = {
  id: string
  answer: string
  answerSpentTime: number
  time: number
  status: string
  createdAt: string
  updatedAt: string
  problem: Problem
}
