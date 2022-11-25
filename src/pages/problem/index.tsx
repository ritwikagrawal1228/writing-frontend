import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import { useQuery, gql } from '@apollo/client'
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

import Layout from '@/components/templates/Layout'
import { TitleBox } from '@/components/templates/common/TitleBox'
import { Path } from '@/constants/Path'
import { colors } from '@/themes/globalStyles'

type Props = {
  userStr: string
  authenticated: boolean
}

export default function ProblemList({ authenticated, userStr }: Props) {
  const user = JSON.parse(userStr || '{}')
  const theme = useTheme()
  const router = useRouter()
  const { data, loading } = useQuery(gql`
    query {
      problemsByUserId(userId: "U1") {
        id
      }
    }
  `)

  const moveCreatePage = () => {
    router.push(Path.ProblemCreate)
  }

  return (
    <Layout title="Problems" description="a">
      <TitleBox title="Problem List">
        <Box sx={{ maxHeight: '36px' }}>
          <Button
            color="primary"
            onClick={moveCreatePage}
            variant="contained"
            startIcon={<AddIcon />}
          >
            <b>新規作成</b>
          </Button>
        </Box>
      </TitleBox>
      <Paper sx={{ minHeight: '500px', textAlign: 'center' }}>
        {loading ? (
          <Box sx={{ p: 10 }}>
            <CircularProgress size={80} />
          </Box>
        ) : (
          <List component="div" disablePadding>
            <ListItem>
              <Card
                sx={{
                  display: 'flex',
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? colors.base.gray
                      : colors.disabled.light,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                      Live From Space
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                    >
                      Mac MilleMac MillerMac MillerMac MillerMac MillerMac
                      MillerMac MillerMac MillerMac MillerMac MillerMac
                      MillerMac MillerMac MillerMac MillerMac MillerMac Millerr
                    </Typography>
                  </CardContent>
                </Box>
                <CardMedia
                  component="img"
                  sx={{ width: 150, height: 150 }}
                  image="https://picsum.photos/200/300"
                  alt="Live from space album cover"
                />
              </Card>
            </ListItem>
          </List>
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
