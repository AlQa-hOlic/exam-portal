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

  type Query {
    users: [User!]!
  }
`