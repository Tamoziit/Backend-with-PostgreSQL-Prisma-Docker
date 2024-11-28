import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Prisma ORM with PostgreSQL DB init

export default prisma;