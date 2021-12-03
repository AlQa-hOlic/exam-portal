import { NextPage } from 'next'
import { getCsrfToken, getSession } from 'next-auth/react'

type Props = {
  csrfToken: string
}

const SignOutPage: NextPage<Props> = ({ csrfToken }) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <form
        method="post"
        action="/api/auth/signout"
        className="flex flex-col justify-center items-center space-y-6"
      >
        <h1 className="text-gray-600 text-4xl">
          Are you sure you want to signout?
        </h1>
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <button
          type="submit"
          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Sign out
        </button>
      </form>
    </div>
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
