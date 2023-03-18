import Layout from '@/components/templates/Layout'
import { Path } from '@/constants/Path'
import { ProblemList } from '@/pages/problem'
import { Page500 } from '@/pages/500'
import { ProblemCreate } from '@/pages/problem/create'
import { ProblemDetail } from '@/pages/problem/[id]'
import { ProblemEdit } from '@/pages/problem/edit/[id]'
import { Page404 } from '@/pages/404'
import { Answer } from '@/pages/problem/answer/[problemId]'
import { FC, memo } from 'react'
import { useRoutes } from 'react-router-dom'
import { AnswerRedeem } from '@/pages/problem/answer/redeem/[answerId]'
import { AnswerReview } from '@/pages/problem/answer/review/[answerId]'
import { DescriptorTask2 } from '@/pages/descriptors/task2'
import { PaymentSubscribe } from '@/pages/payment/subscription'
import { Privacy } from '@/pages/privacy'
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
