import { formatDistanceToNowStrict, isPast } from 'date-fns'
import { useRouter } from 'next/router'
import { FC, useCallback, useEffect, useState } from 'react'
import useSwr from 'swr'
import Button from './button'
import Question from './question'

const Timer: FC<{ due: string; onDue: () => void }> = ({ due, onDue }) => {
  const [value, setValue] = useState(
    formatDistanceToNowStrict(new Date(due), {
      addSuffix: true,
    })
  )

  useEffect(() => {
    const id = setInterval(() => {
      if (isPast(new Date(due))) onDue()
      else
        setValue(
          formatDistanceToNowStrict(new Date(due), {
            addSuffix: true,
          })
        )
    }, 1000)

    return () => clearInterval(id)
  }, [due, onDue])
  return <span className="mr-2">Ends {value}</span>
}

const Exam: FC<{ examId: string; due: string }> = ({ examId, due }) => {
  const router = useRouter()
  const [question, setQuestion] = useState(0)
  const [answers, setAnswers] = useState({})

  const { data } = useSwr<{
    exam: {
      id: string
      title: string
      questions: {
        id: string
        title: string
        answers: {
          id: string
          title: string
        }[]
      }[]
    }
  }>(
    `query($examId: String!){
        exam(examId: $examId) {
          id
          title
          questions {
            id
            title
            answers {
              id
              title
            }
          }
        }
      }
    `,
    async (query) => {
      const options = {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ query, variables: { examId } }),
      }
      const res = await fetch('/api/graphql', options)
      const resJson = await res.json()
      if (resJson.errors) {
        throw JSON.stringify(resJson.errors)
      }
      return resJson.data
    }
  )

  const submitExam = useCallback(async () => {
    await fetch('/api/exams/' + examId + '/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }, [examId, answers])

  if (!data) return null
  return (
    <div className="px-4 w-full">
      <h3 className="my-2 flex justify-between items-center text-gray-600 text-2xl">
        <span>{data.exam.title}</span>
        <span>
          <Timer
            due={due}
            onDue={() => {
              submitExam().then(() => router.push('/'))
            }}
          />
          <Button
            onClick={() => {
              submitExam().then(() => router.push('/'))
            }}
          >
            Submit Exam
          </Button>
        </span>
      </h3>
      <div>
        <Question
          title={data.exam.questions[question].title}
          answers={data.exam.questions[question].answers}
          selectedAnswer={answers[data.exam.questions[question].id] || ''}
          onClick={(id) => {
            setAnswers({
              ...answers,
              ...{ [data.exam.questions[question].id]: id },
            })
          }}
        />
        <h4 className="text-gray-400">
          Showing question {question + 1} of {data.exam.questions.length}
          <Button
            disabled={question == 0}
            onClick={() => {
              if (question !== 0) setQuestion(question - 1)
            }}
          >
            Previous Question
          </Button>
          <Button
            disabled={question >= data.exam.questions.length - 1}
            onClick={() => {
              if (question <= data.exam.questions.length - 2)
                setQuestion(question + 1)
            }}
          >
            Next Question
          </Button>
        </h4>
      </div>
    </div>
  )
}

export default Exam
