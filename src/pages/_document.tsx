import React, { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html prefix="og: http://ogp.me/ns#">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {/* Necessary to prevent error: window.gtag is not defined for Next.js-hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
          }}
        />
      </body>
    </Html>
  )
}
