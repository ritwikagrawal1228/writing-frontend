import { GetServerSideProps } from 'next'
import * as React from 'react'

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import { Box, Button, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { OAuthProviderType } from 'next-auth/providers'
import {
  useSession,
  signIn,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react'
import { useTranslations } from 'next-intl'

import LpNavBar from '@/components/templates/LpNavBar'

const pages = ['Products', 'Pricing', 'Blog']
const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

type Props = {
  providers: Record<LiteralUnion<OAuthProviderType, string>, ClientSafeProvider>
}

export default function Home({ providers }: Props) {
  const t = useTranslations('LP')

  const { data: session, status } = useSession()
  const signInWithProvider = (provider: ClientSafeProvider) => {
    signIn(provider.id).then((res) => {
      alert('ログインしました')
    })
  }

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  )

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <>
      <LpNavBar providerId={providers.cognito.id} />
      <Container
        maxWidth="xl"
        sx={{
          backgroundImage: 'url(/img/lp/bg-darken.jpg)',
          height: 700,
          objectFit: 'cover',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            top: '30%',
            left: 0,
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" color="initial" fontWeight="bold">
              {t('catch')}
            </Typography>
            <Typography
              sx={{ mt: 5 }}
              variant="body1"
              color="initial"
              fontWeight="bold"
            >
              {t('catchDescription')}
            </Typography>
            <Button
              sx={{ mt: 5 }}
              variant="contained"
              endIcon={<DoubleArrowIcon />}
              onClick={() => signInWithProvider(providers.cognito)}
            >
              <b>Start Now</b>
            </Button>
          </Container>
        </Box>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  const { locale } = context
  return {
    props: { providers, messages: require(`@/locales/${locale}.json`) },
  }
}
