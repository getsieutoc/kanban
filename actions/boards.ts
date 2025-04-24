'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma-client';
import { createDefaultLists } from './lists';

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

export const getBoard = async (id: string) => {
  return await prisma.board.findUnique({
    where: { id },
  });
};

export const createBoard = async (input: Prisma.BoardCreateInput) => {
  const board = await prisma.board.create({
    data: input,
  });

  await createDefaultLists(board.id);

  return board;
};
