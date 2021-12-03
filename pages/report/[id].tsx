import { GetServerSidePropsContext, NextPage } from 'next'
import Link from 'next/link'
import Error from 'next/error'
import { getSession, useSession } from 'next-auth/react'
import { format } from 'date-fns'
import useSwr from 'swr'

type Props = {
  id: string
}

const ReportPage: NextPage<Props> = ({ id }) => {
  const { data: session } = useSession()
  const { data } = useSwr<{
    submission: {
      id: string
      exam: { title: string; questionsCount: number }
      createdAt: string
      answersCount: number
      correctAnswersCount: number
    }
  }>(
    `query($id: String!){
        submission(id: $id) {
          id
          createdAt
          exam {
            title
            questionsCount
          }
          answersCount
          correctAnswersCount
        }
      }`,
    async (query) => {
      const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ query, variables: { id } }),
      }
      const res = await fetch('/api/graphql', options)
      const resJson = await res.json()
      if (resJson.errors) {
        throw JSON.stringify(resJson.errors)
      }
      return resJson.data
    }
  )

  if (!session) return null
  if (!data) return <Error statusCode={400} />
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
      <section>
        <div className="mb-4 p-2 flex flex-col justify-center items-start bg-white dark:bg-gray-700 rounded-lg">
          <div className="px-4 w-full">
            <h3 className="my-4 flex justify-between items-center text-gray-600 text-2xl">
              <span>{data.submission.exam.title}</span>
              <span className="text-gray-400 text-lg">
                Submitted on{' '}
                {format(new Date(data.submission.createdAt), 'PPpp')}
              </span>
            </h3>
            <div className="my-8 w-full">
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <td>Number of questions attempted</td>
                    <td>{data.submission.answersCount}</td>
                  </tr>
                  <tr>
                    <td>Total number of questions</td>
                    <td>{data.submission.exam.questionsCount}</td>
                  </tr>
                  <tr>
                    <td>Number of correct answers</td>
                    <td>{data.submission.correctAnswersCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (!session) {
    return { redirect: { permanent: false, destination: '/signin' } }
  }

  return {
    props: {
      session,
      id: context.params?.id,
    },
  }
}

export default ReportPage
