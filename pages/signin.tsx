import { NextPage } from 'next'
import { getCsrfToken, getSession } from 'next-auth/react'

type Props = {
  csrfToken: string
}

const SignInPage: NextPage<Props> = ({ csrfToken }) => {
  return (
    <form method="post" action="/api/auth/signin/email">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email address
        <input type="email" id="email" name="email" />
      </label>
      <button type="submit">Sign in with Email</button>
    </form>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return { redirect: { permanent: false, destination: '/' } }
  }

  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}

export default SignInPage
