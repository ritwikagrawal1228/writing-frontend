export const answerStatus: {
  completed: 'ANSWER_COMPLETED' | 'ANSWER_IN_PROGRESS'
  inProgress: 'ANSWER_COMPLETED' | 'ANSWER_IN_PROGRESS'
} = {
  completed: 'ANSWER_COMPLETED',
  inProgress: 'ANSWER_IN_PROGRESS',
} as const

export type AnswerStatus = typeof answerStatus[keyof typeof answerStatus]
