import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'
import { FC } from 'react'
import useSwr from 'swr'

const Reports: FC<{ userEmail: string }> = ({ userEmail }) => {
  const { data } = useSwr<{
    submissions: {
      id: string
      exam: { title: string }
      createdAt: string
    }[]
  }>(
    `query($userEmail: String!) {
      submissions(userEmail: $userEmail) {
          id
          createdAt
          exam {
            title
          }
        }
      }
    `,
    async (query) => {
      const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ query, variables: { userEmail } }),
      }
      const res = await fetch('/api/graphql', options)
      const resJson = await res.json()
      if (resJson.errors) {
        throw JSON.stringify(resJson.errors)
      }
      return resJson.data
    }
  )

  if (!data) return null
  return (
    <section>
      <div className="mb-4 p-2 flex flex-col justify-center items-start bg-white dark:bg-gray-700 rounded-lg">
        <h2 className="mb-4 px-2 text-2xl text-gray-700">Reports</h2>
        {data.submissions.length === 0 && (
          <div className="px-2 py-1 text-gray-400">No exam reports found!</div>
        )}
        {data.submissions.map((examSubmission) => (
          <span
            key={examSubmission.id}
            className="flex items-center justify-between w-full px-2 py-1 text-gray-500 rounded-lg"
          >
            <span>
              {examSubmission.exam.title}{' '}
              <span className="text-gray-400">
                (Submitted{' '}
                {formatDistanceToNowStrict(new Date(examSubmission.createdAt), {
                  addSuffix: true,
                })}
                )
              </span>
            </span>
            <Link href={`/report/${examSubmission.id}`}>
              <a className="inline-flex ml-4 px-2 py-1 hover:bg-green-200 text-gray-500 hover:text-gray-700 transition-colors rounded-lg">
                View Report
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </a>
            </Link>
          </span>
        ))}
      </div>
    </section>
  )
}

export default Reports
