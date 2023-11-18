import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const connectToDb = () => {
  return prisma.$connect();
};

export const disconnectFromDb = () => {
  return prisma.$disconnect();
};
