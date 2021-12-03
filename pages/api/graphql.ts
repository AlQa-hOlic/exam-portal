import { ApolloServer } from 'apollo-server-micro'
import { NextApiHandler } from 'next'
import { resolvers } from '../../graphql/resolvers'
import { typeDefs } from '../../graphql/schema'
import Cors from 'micro-cors'
import { createContext } from '../../graphql/context'
// import { getSession } from 'next-auth/react'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
})

const startServer = apolloServer.start()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.end()
  }

  //   const session = await getSession({ req })

  //   if (!session) {
  //     return res.status(401).json({
  //       message: 'Unauthorized',
  //     })
  //   }

  await startServer

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

const cors = Cors()

export const config = {
  api: {
    bodyParser: false,
  },
}

export default cors(handler)
