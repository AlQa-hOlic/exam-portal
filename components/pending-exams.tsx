import Link from 'next/link'
import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isFuture,
} from 'date-fns'
import { FC } from 'react'
import useSwr from 'swr'

const PendingExams: FC<{ userEmail: string }> = ({ userEmail }) => {
  const { data } = useSwr<{
    pendingExams: {
      id: string
      user: { id: string }
      startBefore: string
      due: string
      exam: { id: string; title: string }
    }[]
  }>(
    `query($userEmail: String!) {
      pendingExams(userEmail: $userEmail) {
          id
          startBefore
          due
          user {
            email
          }
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
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="mb-4 p-2 flex flex-col justify-center items-start bg-white dark:bg-gray-700 rounded-lg">
        <h2 className="mb-4 px-2 text-2xl text-gray-700">Pending Exams</h2>
        {data.pendingExams.length === 0 && (
          <div className="px-2 py-1 text-gray-400">No pending exams found!</div>
        )}
        {data.pendingExams.map((examRegistration) => (
          <span
            key={examRegistration.id}
            className="flex items-center justify-between w-full px-2 py-1 text-gray-500 rounded-lg"
          >
            {isFuture(new Date(examRegistration.startBefore)) ? (
              <>
                <span>
                  {examRegistration.exam.title}{' '}
                  <span className="text-gray-400">
                    (Starts
                    {' ' +
                      formatDistanceToNowStrict(
                        new Date(examRegistration.startBefore),
                        {
                          addSuffix: true,
                        }
                      )}
                    )
                  </span>
                </span>
                <Link href={`/exam/${examRegistration.id}`}>
                  <a className="inline-flex ml-4 px-2 py-1 hover:bg-green-200 text-gray-500 hover:text-gray-700 transition-colors rounded-lg">
                    Start Exam
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
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                </Link>
              </>
            ) : (
              <>
                <span className="line-through">
                  {examRegistration.exam.title} (
                  {formatDistanceToNow(new Date(examRegistration.startBefore), {
                    addSuffix: true,
                  })}
                  )
                </span>
              </>
            )}
          </span>
        ))}
      </div>
    </section>
  )
}

export default PendingExams
