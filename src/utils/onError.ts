type ErrorInfo = {
  message?: string | undefined
  name?: string | undefined
  stack?: string | undefined
  componentStack?: string
}

export const onError = async (
  err: Error | undefined,
  info: { componentStack: string } | undefined,
) => {
  if (import.meta.env.MODE === 'development') {
    return
  }
  if (err === undefined) {
    return
  }

  const userInfo = {
    url: window.location.href,
    urlQuery: window.location.search,
    urlHash: window.location.search,
    lang: window.navigator.language,
    agent: window.navigator.userAgent,
    width: window.screen.width,
    height: window.screen.height,
  }
  const errDetail: ErrorInfo = {}

  if (err instanceof Error) {
    errDetail.message = err.message
    errDetail.name = err.name
    errDetail.stack = err.stack ? err.stack : ''
    errDetail.componentStack = info?.componentStack || ''
  }

  console.log(err)
}
