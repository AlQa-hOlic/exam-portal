import { formatISO } from 'date-fns'
import { GetServerSidePropsContext, NextPage } from 'next'
import Error from 'next/error'
import { getSession, useSession } from 'next-auth/react'
import prisma from '../../prisma/client'
import Exam from '../../components/exam'

const ExamPage: NextPage<{
  examId: string
  examSubmissionDue: string
  examNotFound: boolean
}> = ({ examId, examSubmissionDue, examNotFound }) => {
  const { data: session } = useSession()

  if (examNotFound) return <Error statusCode={400} />
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
        </div>
      </header>
      <section>
        <div className="mb-4 p-2 flex flex-col justify-center items-start bg-white dark:bg-gray-700 rounded-lg">
          <Exam examId={examId} due={examSubmissionDue} />
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

  try {
    const examRegistration = await prisma.examRegistration.delete({
      where: {
        id: String(context.params?.id),
      },
    })

    return {
      props: {
        session,
        examId: examRegistration.examId,
        examSubmissionDue: formatISO(new Date(examRegistration.due)),
      },
    }
  } catch (e) {
    return {
      props: {
        session,
        examNotFound: true,
      },
    }
  }
}

export default ExamPage
