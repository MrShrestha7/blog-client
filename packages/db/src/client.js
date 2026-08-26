import { PrismaClient } from "@prisma/client";
import { env } from "@repo/env/web";
export const createClient = () => {
    console.log("createClient called");
    console.log("DATABASE_URL:", env.DATABASE_URL);
    if (global.prisma) {
        console.log("Using cached Prisma client");
        return global.prisma;
    }
    console.log("Creating new Prisma client");
    const prisma = new PrismaClient({
        datasourceUrl: env.DATABASE_URL,
    });
    global.prisma = prisma;
    return prisma;
};
export const client = {
    get db() {
        return createClient();
    },
};
