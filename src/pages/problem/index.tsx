import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  List,
  ListItem,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { withSSRContext } from 'aws-amplify'
import request from 'graphql-request'
import { useTranslations } from 'next-intl'
import useSWR from 'swr'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { Path } from '@/constants/Path'
import { colors } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'

type Props = {
  userStr: string
  authenticated: boolean
}

type ProblemsByUserId = {
  problemsByUserId: Problem[]
}

export default function ProblemList({ authenticated, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()
  const getQuery = useMemo(() => {
    return `query {
      problemsByUserId(userId: "${user.id}") {
        id
        title
        question
        questionImageUrl
        taskType
        createdAt
      }
    }`
  }, [user])
  const { data, error } = useSWR<ProblemsByUserId>(getQuery, (query) =>
    request('/api/graphql', query),
  )

  const moveCreatePage = () => {
    router.push(Path.ProblemCreate)
  }

  return (
    <Layout
      title={t('title')}
      description={t('description')}
      breadcrumbs={[{ label: t('title'), href: undefined }]}
    >
      <TitleBox title={t('title')} guide="">
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            onClick={moveCreatePage}
            variant="contained"
            startIcon={<AddIcon />}
          >
            <b>{t('addBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      <Paper sx={{ minHeight: '300px', textAlign: 'center', p: 3 }}>
        {!data ? (
          <Box sx={{ p: 10 }}>
            <CircularProgress size={80} />
          </Box>
        ) : data.problemsByUserId.length > 0 ? (
          <List component="div" disablePadding>
            {data.problemsByUserId.map((problem: any) => (
              <ListItem key={problem.id}>
                <Card
                  sx={{
                    display: 'flex',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? colors.base.gray
                        : colors.disabled.light,
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{ width: 300, height: 150 }}
                    image={problem.questionImageUrl}
                    alt="Live from space album cover"
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5">
                        {problem.title}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        component="div"
                      >
                        {problem.question}
                      </Typography>
                    </CardContent>
                  </Box>
                </Card>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 10 }}>
            <Typography variant="h6" fontWeight="bold">
              {t('empty')}
            </Typography>
            <br />
            <Button
              color="primary"
              onClick={moveCreatePage}
              variant="contained"
              startIcon={<AddIcon />}
            >
              <b>{t('addBtn')}</b>
            </Button>
          </Box>
        )}
      </Paper>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context
  const { Auth } = withSSRContext({ req: context.req })

  try {
    const user = await Auth.currentAuthenticatedUser()

    return {
      props: {
        authenticated: true,
        userStr: JSON.stringify(user.attributes),
        messages: require(`@/locales/${locale}.json`),
      },
    }
  } catch (err) {
    console.error(err)
    return {
      redirect: {
        permanent: false,
        destination: '/auth',
      },
    }
  }
}
