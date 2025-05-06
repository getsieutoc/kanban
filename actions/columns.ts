'use server';

import { prisma } from '@/lib/prisma-client';
import { cardIncludes } from '@/lib/rich-includes';
import { Prisma } from '@/types';

export const getColumnsFromBoard = async (boardId: string) => {
  return await prisma.column.findMany({
    where: {
      boardId,
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc',
        },
        include: cardIncludes,
      },
    },
    orderBy: {
      order: 'asc',
    },
  });
};

export const createDefaultColumns = async (boardId: string) => {
  return await prisma.column.createMany({
    data: [
      { title: 'To Do', order: 0, boardId },
      { title: 'In Progress', order: 1, boardId },
      { title: 'Done', order: 2, boardId },
    ],
  });
};

export const createColumn = async (input: Prisma.ColumnCreateArgs) => {
  return await prisma.column.create(input);
};

export const updateColumn = async (input: Prisma.ColumnUpdateArgs) => {
  return await prisma.column.update(input);
};

export const deleteColumn = async (id: string) => {
  // First delete all cards in this column
  await prisma.card.deleteMany({
    where: { columnId: id },
  });

  // Then delete the column
  return await prisma.column.delete({
    where: { id },
  });
};
