import { addHours } from 'date-fns'
import { Context } from './context'

export const resolvers = {
  Mutation: {
    createRegistration: async (parent, args, ctx: Context) => {
      const registration = await ctx.db.examRegistration.create({
        data: {
          examId: args.examId,
          userId: args.userId,
          due: addHours(new Date(), 2),
          startBefore: addHours(new Date(), 1),
        },
      })

      return registration.id
    },
    setCorrectAnswer: async (parent, args, ctx: Context) => {
      return await ctx.db.question.update({
        where: {
          id: args.questionId,
        },
        data: {
          correctAnswerId: args.answerId,
        },
      })
    },
    addAnswer: async (parent, args, ctx: Context) => {
      return await ctx.db.answer.create({
        data: {
          title: args.title,
          questionId: args.questionId,
        },
      })
    },
    addQuestion: async (parent, args, ctx: Context) => {
      return await ctx.db.question.create({
        data: {
          title: args.title,
          examId: args.examId,
        },
      })
    },
    addExam: async (parent, args, ctx: Context) => {
      return await ctx.db.exam.create({
        data: {
          title: args.title,
        },
      })
    },
  },
  Query: {
    users: async (parent, args, ctx: Context) => {
      return await ctx.db.user.findMany()
    },
    questions: async (parent, args, ctx: Context) => {
      return await ctx.db.question.findMany()
    },
    exam: async (parent, args, ctx: Context) => {
      return await ctx.db.exam.findUnique({
        where: { id: args.examId },
      })
    },
    exams: async (parent, args, ctx: Context) => {
      return await ctx.db.exam.findMany()
    },
    pendingExams: async (parent, args, ctx: Context) => {
      const user = await ctx.db.user.findUnique({
        where: { email: args.userEmail },
      })
      return await ctx.db.examRegistration.findMany({
        where: { userId: user.id },
      })
    },
    submissions: async (parent, args, ctx: Context) => {
      const user = await ctx.db.user.findUnique({
        where: { email: args.userEmail },
      })
      return await ctx.db.examSubmission.findMany({
        where: { userId: user.id },
      })
    },
    submission: async (parent, args, ctx: Context) => {
      return await ctx.db.examSubmission.findUnique({
        where: { id: args.id },
      })
    },
  },
  Exam: {
    questionsCount: async (parent, args, ctx: Context) => {
      return await ctx.db.question.count({
        where: {
          examId: parent.id,
        },
      })
    },
    questions: async (parent, args, ctx: Context) => {
      return await ctx.db.question.findMany({
        where: {
          examId: parent.id,
        },
      })
    },
  },
  Question: {
    exam: async (parent, args, ctx: Context) => {
      return await ctx.db.exam.findUnique({
        where: {
          id: parent.examId,
        },
      })
    },
    answers: async (parent, args, ctx: Context) => {
      return await ctx.db.answer.findMany({
        where: {
          questionId: parent.id,
        },
      })
    },
    correctAnswer: async (parent, args, ctx: Context) => {
      return await ctx.db.answer.findUnique({
        where: {
          id: parent.correctAnswerId,
        },
      })
    },
  },
  Answer: {
    question: async (parent, args, ctx: Context) => {
      return await ctx.db.question.findUnique({
        where: {
          id: parent.questionId,
        },
      })
    },
  },
  Registration: {
    exam: async (parent, args, ctx: Context) => {
      return await ctx.db.exam.findUnique({
        where: {
          id: parent.examId,
        },
      })
    },
    user: async (parent, args, ctx: Context) => {
      return await ctx.db.user.findUnique({
        where: {
          id: parent.userId,
        },
      })
    },
  },
  Submission: {
    exam: async (parent, args, ctx: Context) => {
      return await ctx.db.exam.findUnique({
        where: {
          id: parent.examId,
        },
      })
    },
    user: async (parent, args, ctx: Context) => {
      return await ctx.db.user.findUnique({
        where: {
          id: parent.userId,
        },
      })
    },
    answersCount: async (parent, args, ctx: Context) => {
      return await ctx.db.examSubmissionAnswer.count({
        where: { examSubmissionId: parent.id },
      })
    },
    correctAnswersCount: async (parent, args, ctx: Context) => {
      const submissionAnswers = await ctx.db.examSubmissionAnswer.findMany({
        where: { examSubmissionId: parent.id },
      })

      const questions = await ctx.db.question.findMany({
        where: { examId: parent.examId },
      })

      return submissionAnswers
        .map((submissionAnswer) => {
          const results = questions.filter(
            (q) => q.id === submissionAnswer.questionId
          )

          if (results.length !== 0) {
            return results[0].correctAnswerId === submissionAnswer.answerId
          }
        })
        .filter((t) => t).length
    },
  },
}
