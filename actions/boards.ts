'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma-client';

export const getBoards = async (input?: Prisma.BoardFindManyArgs) => {
  return await prisma.board.findMany(input);
};

export const getBoardsFromTenant = async (tenantId: string) => {
  return await prisma.board.findMany({
    where: {
      tenantId,
    },
  });
};

export const createBoard = async (input: Prisma.BoardCreateInput) => {
  const board = await prisma.board.create({
    data: input,
  });

  return board;
};
