import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect } from 'react'

import AddIcon from '@mui/icons-material/Add'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { Storage, withSSRContext } from 'aws-amplify'
import { useTranslations } from 'next-intl'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { Path } from '@/constants/Path'
import { ProblemType } from '@/constants/ProblemType'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { problemService } from '@/services/problemService'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'

type Props = {
  userStr: string
  authenticated: boolean
  problems: Problem[]
}

export default function ProblemList({
  authenticated,
  userStr,
  problems,
}: Props) {
  useGetAuthUser(userStr)
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()
  const [images, setImages] = React.useState<{ id: string; src: string }[]>([])

  const moveCreatePage = () => {
    router.push(Path.ProblemCreate)
  }

  const moveDetail = (problemId: string) => {
    router.push(`${Path.Problem}/${problemId}`)
  }

  useEffect(() => {
    if (!problems || problems.length === 0) {
      return
    }

    problems.map((prob) => {
      if (prob.questionImageKey) {
        Storage.get(prob.questionImageKey).then((res) => {
          // update images src
          setImages((prev) => [...prev, { id: prob.id, src: res }])
        })
      }
    })
  }, [problems])

  return (
    <Layout
      title={t('list.title')}
      description={t('list.description')}
      breadcrumbs={[{ label: t('list.title'), href: undefined }]}
    >
      <TitleBox title={t('list.title')}>
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            onClick={moveCreatePage}
            variant="contained"
            startIcon={<AddIcon />}
          >
            <b>{t('list.addBtn')}</b>
          </Button>
        </Box>
      </TitleBox>
      <Paper sx={{ minHeight: '460px', textAlign: 'center', p: 4 }}>
        {!problems ? (
          <Box sx={{ p: 10 }}>
            <CircularProgress size={80} />
          </Box>
        ) : problems.length > 0 ? (
          <List
            sx={{
              width: '100%',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? colors.base.gray
                  : colors.disabled.light,
              borderRadius: 1,
              py: 0,
            }}
          >
            {problems.map((problem: Problem, i: number) => (
              <Fragment key={problem.id}>
                <ListItem
                  alignItems="flex-start"
                  component="div"
                  disablePadding
                  secondaryAction={
                    <Chip
                      variant="outlined"
                      label={ProblemType[problem.taskType]}
                      color={
                        ProblemType[problem.taskType] === 'Task 1'
                          ? 'primary'
                          : 'secondary'
                      }
                    />
                  }
                >
                  <ListItemButton onClick={() => moveDetail(problem.id)}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        alt={problem.title}
                        src={
                          images.find((image) => image.id === problem.id)
                            ?.src || '/img/noImage.jpg'
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ mr: 5 }}
                      primary={problem.title}
                      secondary={
                        <Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {problem.question}
                          </Typography>
                          <Typography fontSize={fontSizes.s} sx={{ mt: 1 }}>
                            {new Date(problem.createdAt).toLocaleDateString()}{' '}
                          </Typography>
                        </Fragment>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {problems[i + 1] && <Divider variant="inset" component="li" />}
              </Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 10 }}>
            <Typography variant="h6" fontWeight="bold">
              {t('list.empty')}
            </Typography>
            <br />
            <Button
              color="primary"
              onClick={moveCreatePage}
              variant="contained"
              startIcon={<AddIcon />}
            >
              <b>{t('list.addBtn')}</b>
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

    const { problemsByUserId } = await problemService.getProblemsByUserId(user)

    return {
      props: {
        authenticated: true,
        userStr: JSON.stringify(user.attributes),
        messages: require(`@/locales/${locale}.json`),
        problems: problemsByUserId,
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
