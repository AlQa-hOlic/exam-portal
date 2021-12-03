import { NextPage } from 'next'
import { getCsrfToken, getSession } from 'next-auth/react'

type Props = {
  csrfToken: string
}

const SignOutPage: NextPage<Props> = ({ csrfToken }) => {
  return (
    <form method="post" action="/api/auth/signout">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <button type="submit">Sign out</button>
    </form>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return { redirect: { permanent: false, destination: '/signin' } }
  }

  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}

export default SignOutPage
