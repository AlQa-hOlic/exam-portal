import { FC } from 'react'

const Question: FC<{
  title: string
  answers: { id: string; title: string }[]
  selectedAnswer: string
  onClick: (id) => void
}> = ({ title, answers, selectedAnswer, onClick }) => {
  return (
    <div className="my-8">
      <h4 className="text-3xl">{title}</h4>
      {answers.map((answer) => (
        <div
          key={answer.id}
          className={`my-2 py-2 px-4 rounded-lg${
            answer.id === selectedAnswer
              ? ' bg-green-200'
              : ' hover:bg-gray-100 cursor-pointer'
          }`}
          onClick={() => onClick(answer.id)}
        >
          {answer.title}
        </div>
      ))}
    </div>
  )
}
export default Question
