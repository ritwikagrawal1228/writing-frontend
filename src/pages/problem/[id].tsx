//型を利用するためにインポート
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

import { Grid, Paper } from '@mui/material'

import Layout from '@/components/templates/Layout'

type PostProps = { id: string }

export default function ProblemDetail({ id }: PostProps) {
  const router = useRouter()

  return (
    <Layout title="title" description="a">
      <Grid container>
        <Grid item>
          <Paper sx={{ backgroundColor: '#fff' }}>{id}</Paper>
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths = [
    { params: { id: '1' }, locale: 'en' },
    { params: { id: '1' }, locale: 'ja' },
    { params: { id: '2' } },
    { params: { id: '3' } },
  ]

  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<PostProps> = async (context) => {
  const { locale } = context
  const id: string = Array.isArray(context.params?.['id'])
    ? context.params?.['id'][0] || ''
    : context.params?.['id'] || ''

  return {
    props: {
      id,
      messages: require(`../../locales/${locale}.json`),
    },
  }
}
