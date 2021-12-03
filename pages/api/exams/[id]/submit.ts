import { NextApiHandler } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../prisma/client'

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).end('Unauthorized')
  }

  if (req.method !== 'POST') {
    return res.status(403).json({
      message: 'Method not allowed',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  })

  const examSubmission = await prisma.examSubmission.create({
    data: {
      examId: req.query.id as string,
      userId: user.id,
    },
  })

  const submissions = Object.keys(req.body.answers).map(async (key) => {
    const examSubmissionAnswer = await prisma.examSubmissionAnswer.create({
      data: {
        examSubmissionId: examSubmission.id,
        answerId: req.body.answers[key],
        questionId: key,
      },
    })
    return examSubmissionAnswer
  })

  res.json(submissions)
}

export default handler
