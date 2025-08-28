import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Enhanced Prisma client configuration for build-time compatibility
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Gracefully handle disconnection
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting Prisma:', error)
  }
})

// Handle build-time database connection issues
process.on('SIGINT', async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting Prisma on SIGINT:', error)
  }
  process.exit(0)
})

process.on('SIGTERM', async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting Prisma on SIGTERM:', error)
  }
  process.exit(0)
})
