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
import useSWR from 'swr'

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { Path } from '@/constants/Path'
import { ProblemType } from '@/constants/ProblemType'
import { useGetAuthUser } from '@/hooks/useGetAuthUser'
import { postService } from '@/services/postService'
import { colors, fontSizes } from '@/themes/globalStyles'
import { Problem } from '@/types/model/problem'
import { roundSentence } from '@/utils/roundSentence'

type Props = {
  userStr: string
  authenticated: boolean
}

type ProblemsByUserId = {
  data: {
    problemsByUserId: Problem[] | []
  }
}

export default function ProblemList({ authenticated, userStr }: Props) {
  const { user } = useGetAuthUser(userStr)
  const theme = useTheme()
  const t = useTranslations('Problem')
  const router = useRouter()
  const [images, setImages] = React.useState<{ id: string; src: string }[]>([])

  const { data: res } = useSWR<ProblemsByUserId>(user?.id, (userId) =>
    postService.getProblemsByUserId(userId),
  )

  const moveCreatePage = () => {
    router.push(Path.ProblemCreate)
  }

  const moveDetail = (problemId: string) => {
    router.push(`${Path.Problem}/${problemId}`)
  }

  useEffect(() => {
    if (!res) {
      return
    }

    res.data.problemsByUserId.map((prob) => {
      if (prob.questionImageKey) {
        Storage.get(prob.questionImageKey).then((res) => {
          console.log(res)

          // update images src
          setImages((prev) => [...prev, { id: prob.id, src: res }])
        })
      }
    })
  }, [res])

  return (
    <Layout
      title={t('title')}
      description={t('description')}
      breadcrumbs={[{ label: t('title'), href: undefined }]}
    >
      <TitleBox title={t('title')}>
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
      <Paper
        sx={{ minHeight: '460px', textAlign: 'center', pt: 5, pl: 5, pb: 5 }}
      >
        {!res ? (
          <Box sx={{ p: 10 }}>
            <CircularProgress size={80} />
          </Box>
        ) : res.data.problemsByUserId?.length > 0 ? (
          <Grid
            container
            spacing={5}
            sx={{ width: '100%', mr: 0 }}
            justifyContent="start"
          >
            {res.data.problemsByUserId.map((problem: any) => (
              <Grid item key={problem.id}>
                <Card
                  sx={{
                    width: '235px',
                    height: '380.2px',
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
                      height="145.2px"
                      image={
                        images.find((image) => image.id === problem.id)?.src ||
                        'img/noImage.jpg'
                      }
                    />
                    <CardContent sx={{ minHeight: '180px', p: 2 }}>
                      <Typography
                        gutterBottom
                        fontSize={fontSizes.l}
                        fontWeight="bold"
                      >
                        {roundSentence(problem.title, 55)}
                      </Typography>
                      <Typography
                        fontSize={fontSizes.m}
                        color="text.secondary"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {roundSentence(problem.question, 47)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" sx={{ mr: 3 }}>
                      <Chip
                        variant="outlined"
                        label={ProblemType[problem.taskType]}
                        color={
                          ProblemType[problem.taskType] === 'Task 1'
                            ? 'primary'
                            : 'secondary'
                        }
                      />
                    </Button>
                    {new Date(problem.createdAt).toLocaleDateString()}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
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
