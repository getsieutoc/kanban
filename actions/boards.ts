'use server';

import { prisma } from '@/lib/prisma-client';
import { Prisma } from '@/types';

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

export const updateBoard = async (input: Prisma.BoardUpdateArgs) => {
  return await prisma.board.update(input);
};

export const deleteBoard = async (id: string) => {
  // First delete all associated lists and cards to avoid constraint errors
  const lists = await prisma.list.findMany({
    where: { boardId: id },
    select: { id: true },
  });
  
  const listIds = lists.map(list => list.id);
  
  // Delete all cards in those lists
  await prisma.card.deleteMany({
    where: { listId: { in: listIds } },
  });
  
  // Delete all lists
  await prisma.list.deleteMany({
    where: { boardId: id },
  });
  
  // Delete the board itself
  return await prisma.board.delete({
    where: { id },
  });
};
