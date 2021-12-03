import { PrismaClient } from '.prisma/client'
import prisma from '../prisma/client'

export type Context = {
  db: PrismaClient
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createContext = async (req, res): Promise<Context> => {
  return {
    db: prisma,
  }
}
