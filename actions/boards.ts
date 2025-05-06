'use server';

import { prisma } from '@/lib/prisma-client';
import { Prisma } from '@/types';

import { createDefaultColumns } from './columns';

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

type CreateBoardOptions = {
  createDefaultColumns?: boolean;
};
export const createBoard = async (
  input: Prisma.BoardCreateInput,
  options?: CreateBoardOptions
) => {
  const board = await prisma.board.create({
    data: input,
  });

  if (options?.createDefaultColumns) {
    await createDefaultColumns(board.id);
  }

  return board;
};

export const updateBoard = async (input: Prisma.BoardUpdateArgs) => {
  return await prisma.board.update(input);
};

export const deleteBoard = async (id: string) => {
  // First delete all associated columns and cards to avoid constraint errors
  const columns = await prisma.column.findMany({
    where: { boardId: id },
    select: { id: true },
  });

  const columnIds = columns.map((column) => column.id);

  // Delete all cards in those columns
  await prisma.card.deleteMany({
    where: { columnId: { in: columnIds } },
  });

  // Delete all columns
  await prisma.column.deleteMany({
    where: { boardId: id },
  });

  // Delete the board itself
  return await prisma.board.delete({
    where: { id },
  });
};
