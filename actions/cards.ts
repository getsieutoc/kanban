'use server';

import { Prisma } from '@/prisma/client';
import { prisma } from '@/lib/prisma-client';

export const createCard = async (input: Prisma.CardCreateArgs) => {
  return await prisma.card.create(input);
};

export const updateCard = async (input: Prisma.CardUpdateArgs) => {
  return await prisma.card.update(input);
};

export const reorderCard = async ({
  id,
  order,
  listId
}: {
  id: string;
  order: number;
  listId?: string;
}) => {
  return await prisma.card.update({
    where: { id },
    data: {
      order,
      ...(listId && { listId }),
    },
  });
};

export const deleteCard = async (id: string) => {
  return await prisma.card.delete({
    where: { id },
  });
};
