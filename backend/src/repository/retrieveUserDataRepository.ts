import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const retrieveUserDataRepository = async (userId: number) => {
  return await prisma.todos.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' }, // optional, sort by createdAt descending
  });
};
