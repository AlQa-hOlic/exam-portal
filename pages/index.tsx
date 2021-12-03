import { NextPage } from 'next'
import Link from 'next/link'
import { getSession, useSession } from 'next-auth/react'
import PendingExams from '../components/pending-exams'
import Reports from '../components/reports'

const HomePage: NextPage = () => {
  const { data: session } = useSession()

  if (!session) return null
  return (
    <main className="relative h-screen p-4 bg-gray-100 dark:bg-gray-800 overflow-x-hidden select-none">
      <header className="mb-4 px-4 flex justify-between items-center bg-white dark:bg-gray-700 rounded-lg">
        <div className="space-x-2 py-4">
          <span className="text-gray-500 p-2 rounded-lg">Exam Portal</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-gray-400 hidden md:inline">
            Signed in as {session.user.email}
          </span>
          <Link href="/signout">
            <a className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </a>
          </Link>
        </div>
      </header>
      <PendingExams userEmail={session.user.email} />
      <Reports userEmail={session.user.email} />
    </main>
  )
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
