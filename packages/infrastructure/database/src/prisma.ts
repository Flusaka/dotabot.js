import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;

const postgresAdapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter: postgresAdapter });

export default prisma;
