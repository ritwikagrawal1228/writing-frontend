export const userPlans = ['FREE', 'PRO'] as const

export type UserPlan = typeof userPlans[number]
