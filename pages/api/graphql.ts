import { ApolloServer } from 'apollo-server-micro'
import { NextApiHandler } from 'next'
import { resolvers } from '../../graphql/resolvers'
import { typeDefs } from '../../graphql/schema'
import Cors from 'micro-cors'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

const startServer = apolloServer.start()

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.end()
  }

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
