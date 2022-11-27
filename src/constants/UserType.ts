export const userTypes = ['STUDENT', 'TEACHER'] as const

export type UserType = typeof userTypes[number]
