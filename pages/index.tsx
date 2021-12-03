import { NextPage } from 'next'
import { useSession } from 'next-auth/react'

const HomePage: NextPage = () => {
  const { data } = useSession()

  if (!data) return null
  return <pre>Hello, world!</pre>
}

export default HomePage
