import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismadb = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prismadb

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismadb