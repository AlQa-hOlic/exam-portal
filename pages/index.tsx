import { NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'

const HomePage: NextPage = () => {
  const { data } = useSession()

  if (!data) return null
  return <pre>Hello, world!</pre>
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  if (!session) {
    return { redirect: { permanent: false, destination: '/signin' } }
  }

  return {
    props: { session },
  }
}

export default HomePage
