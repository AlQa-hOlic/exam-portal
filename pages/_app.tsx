import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'

import 'tailwindcss/tailwind.css'

const _App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default _App
