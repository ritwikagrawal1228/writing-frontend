import { Problem } from '@/types/model/problem'

export type Answer = {
  id: string
  answer: string
  answerSpentTime: number
  time: number
  status: string
  createdAt: string
  updatedAt: string
  completedAnswerSentences: CompletedAnswerSentence[]
  problem: Problem
}

export type CompletedAnswerSentence = {
  num: number
  sentence: string
}
