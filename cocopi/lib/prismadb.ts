import { PrismaClient } from "@prisma/client";

const prismadb = global.prismadb || new PrismaClient();
if (process.env.NODE_ENV == 'production') global.prismadb = client;

export default prismadb;