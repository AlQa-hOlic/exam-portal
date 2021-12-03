import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  scalar DateTime

  type User {
    id: String!
    createdAt: DateTime
    updatedAt: DateTime
    email: String!
    emailVerified: DateTime
    role: String!
  }

  type Answer {
    id: String!
    title: String!
    question: Question!
  }

  type Question {
    id: String!
    title: String!
    exam: Exam!
    correctAnswer: Answer!
    answers: [Answer!]!
  }

  type Exam {
    id: String!
    title: String!
    questions: [Question!]!
    questionsCount: Int
  }

  type Registration {
    id: String!
    user: User!
    startBefore: DateTime
    due: DateTime
    exam: Exam!
  }

  type Submission {
    id: String!
    exam: Exam!
    user: User!
    createdAt: DateTime
    answersCount: Int
    correctAnswersCount: Int
  }

  type Query {
    users: [User!]!
    questions: [Question!]!
    exams: [Exam!]!
    exam(examId: String!): Exam!
    pendingExams(userEmail: String!): [Registration!]!
    submissions(userEmail: String!): [Submission!]!
    submission(id: String!): Submission!
  }

  type Mutation {
    addExam(title: String!): Exam!
    addQuestion(examId: String!, title: String!): Question!
    addAnswer(questionId: String!, title: String!): Answer!
    setCorrectAnswer(questionId: String!, answerId: String!): Question!
    createRegistration(examId: String!, userId: String!): String!
  }
`
