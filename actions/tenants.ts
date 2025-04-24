'use server';

import { prisma } from '@/lib/prisma-client';

export const findTenant = async (id?: string | null) => {
  if (!id) return null;

  const workspace = await prisma.tenant.findUnique({
    where: { id },
  });

  return workspace;
};
