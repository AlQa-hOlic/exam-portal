import { NextPage } from 'next'
import { getCsrfToken, getSession } from 'next-auth/react'

type Props = {
  csrfToken: string
}

const SignInPage: NextPage<Props> = ({ csrfToken }) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <form
        className="flex flex-col items-start justify-center space-y-4"
        method="post"
        action="/api/auth/signin/email"
      >
        <h1 className="text-gray-600 text-4xl">Login</h1>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email..."
          className="p-2 bg-gray-100 rounded-lg"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Submit
        </button>
      </form>
    </div>
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
