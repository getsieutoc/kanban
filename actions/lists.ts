'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma-client';

export const getListsFromBoard = async (boardId: string) => {
  return await prisma.list.findMany({
    where: {
      boardId,
    },
    include: {
      cards: {
        orderBy: {
          order: 'asc',
        },
        include: {
          assignees: true,
          labels: {
            include: {
              label: true,
            },
          },
        },
      },
    },
    orderBy: {
      order: 'asc',
    },
  });
};

export const createDefaultLists = async (boardId: string) => {
  return await prisma.list.createMany({
    data: [
      { title: 'To Do', order: 0, boardId },
      { title: 'In Progress', order: 1, boardId },
      { title: 'Done', order: 2, boardId },
    ],
  });
};

export const createList = async (input: Prisma.ListCreateArgs) => {
  return await prisma.list.create(input);
};

export const updateList = async (input: Prisma.ListUpdateArgs) => {
  return await prisma.list.update(input);
};
