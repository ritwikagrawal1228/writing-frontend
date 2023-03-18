import React, { FC, memo } from 'react'
import { useRoutes } from 'react-router-dom'

import Layout from '@/components/templates/Layout'
import { Path } from '@/constants/Path'
import { Page404 } from '@/pages/404'
import { Page500 } from '@/pages/500'
import { DescriptorTask2 } from '@/pages/descriptors/task2'
import { PaymentSubscribe } from '@/pages/payment/subscription'
import { Privacy } from '@/pages/privacy'
import { ProblemList } from '@/pages/problem'
import { ProblemDetail } from '@/pages/problem/[id]'
import { Answer } from '@/pages/problem/answer/[problemId]'
import { AnswerRedeem } from '@/pages/problem/answer/redeem/[answerId]'
import { AnswerReview } from '@/pages/problem/answer/review/[answerId]'
import { ProblemCreate } from '@/pages/problem/create'
import { ProblemEdit } from '@/pages/problem/edit/[id]'
import { NotificationSetting } from '@/pages/settings/notifications'
import { PaymentSetting } from '@/pages/settings/payment'
import { ProfileSetting } from '@/pages/settings/profile'
import Terms from '@/pages/terms'

export const Router: FC = memo(() => {
  const homeRoutes = useRoutes([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: Path.Problem,
          element: <ProblemList />,
        },
        {
          path: Path.ProblemCreate,
          element: <ProblemCreate />,
        },
        {
          path: Path.ProblemDetail,
          element: <ProblemDetail />,
        },
        {
          path: Path.ProblemEdit,
          element: <ProblemEdit />,
        },
        {
          path: Path.ProblemAnswer,
          element: <Answer />,
        },
        {
          path: Path.ProblemAnswerRedeem,
          element: <AnswerRedeem />,
        },
        {
          path: Path.ProblemAnswerReview,
          element: <AnswerReview />,
        },
        {
          path: Path.Descriptors,
          element: <DescriptorTask2 />,
        },
        {
          path: Path.PaymentSubscription,
          element: <PaymentSubscribe />,
        },
        {
          path: Path.Privacy,
          element: <Privacy />,
        },
        {
          path: Path.NotificationSettings,
          element: <NotificationSetting />,
        },
        {
          path: Path.PaymentSettings,
          element: <PaymentSetting />,
        },
        {
          path: Path.ProfileSettings,
          element: <ProfileSetting />,
        },
        {
          path: Path.Terms,
          element: <Terms />,
        },
        {
          path: 'error',
          element: <Page500 />,
        },
        {
          path: '*',
          element: <Page404 />,
        },
      ],
    },
  ])

  return homeRoutes
})

Router.displayName = 'Router'
