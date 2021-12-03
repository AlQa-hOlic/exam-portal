import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Error from 'next/error'

const VerifyPage: NextPage = () => {
  const router = useRouter()
  const error = {
    EmailSignin: {
      statusCode: 500,
      title: 'Could not send email',
    },
    Verification: {
      statusCode: 400,
      title: 'Verification link has exipired or has already been used',
    },
  }[router.query.error as string] || {
    statusCode: 500,
    title: 'Internal Server Error',
  }
  return <Error statusCode={error.statusCode} title={error.title} />
}

export default VerifyPage
