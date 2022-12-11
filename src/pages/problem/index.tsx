import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import AddIcon from '@mui/icons-material/Add'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
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
import { roundSentence } from '@/utils/roundSentence'

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
  const { user } = useGetAuthUser(userStr)
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
      <Paper
        sx={{ minHeight: '460px', textAlign: 'center', pt: 5, pl: 5, pb: 5 }}
      >
        {!problems ? (
          <Box sx={{ p: 10 }}>
            <CircularProgress size={80} />
          </Box>
        ) : problems.length > 0 ? (
          <Grid
            container
            spacing={5}
            sx={{ width: '100%', mr: 0 }}
            justifyContent="start"
          >
            {problems.map((problem: Problem) => (
              <Grid item key={problem.id}>
                <Card
                  sx={{
                    width: '324px',
                    height: '400.4px',
                    textAlign: 'left',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? colors.base.gray
                        : colors.disabled.light,
                  }}
                  key={problem.id}
                >
                  <CardActionArea onClick={() => moveDetail(problem.id)}>
                    <CardMedia
                      component="img"
                      height="200.2px"
                      image={
                        images.find((image) => image.id === problem.id)?.src ||
                        '/img/noImage.jpg'
                      }
                    />
                    <CardContent sx={{ minHeight: '145.2px', p: 2 }}>
                      <Typography
                        gutterBottom
                        fontSize={fontSizes.l}
                        fontWeight="bold"
                      >
                        {roundSentence(problem.title, 55)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Chip
                            variant="outlined"
                            label={ProblemType[problem.taskType]}
                            color={
                              ProblemType[problem.taskType] === 'Task 1'
                                ? 'primary'
                                : 'secondary'
                            }
                          />
                        </Grid>
                        <Grid item>
                          <Typography fontSize={fontSizes.s}>
                            {new Date(problem.createdAt).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardActions>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
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
