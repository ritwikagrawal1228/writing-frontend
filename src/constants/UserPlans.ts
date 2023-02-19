export const UserPlanPro = 'PRO' as const
export const UserPlanFree = 'FREE' as const

export const userPlans = [UserPlanFree, UserPlanPro] as const

export type UserPlan = typeof userPlans[number]
