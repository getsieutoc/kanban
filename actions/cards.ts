'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma-client';

export const createCard = async (input: Prisma.CardCreateArgs) => {
  return await prisma.card.create(input);
};

export const updateCard = async (input: Prisma.CardUpdateArgs) => {
  return await prisma.card.update(input);
};
