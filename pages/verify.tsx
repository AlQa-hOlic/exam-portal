import { NextPage } from 'next'
import { getSession } from 'next-auth/react'

const VerifyPage: NextPage = ({}) => {
  return (
    <div className="h-screen flex justify-center items-center">
      <pre>Verify your email</pre>
    </div>
  )
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
