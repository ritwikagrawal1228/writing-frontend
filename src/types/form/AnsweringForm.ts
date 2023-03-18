import { AnswerStatus } from '@/constants/AnswerStatus'

export type AnsweringForm = {
  answer: string
  status: AnswerStatus
  time: number
  countDownSec: number
}
