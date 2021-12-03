import { NextPage } from 'next'
import { getSession } from 'next-auth/react'

const VerifyPage: NextPage = ({}) => {
  return <pre>Verify your email</pre>
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (session) {
    return { redirect: { permanent: false, destination: '/' } }
  }

  return {
    props: {},
  }
}

export default VerifyPage
