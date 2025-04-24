'use server';

import { MembershipRole, MembershipStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma-client';

export const findTenant = async (id?: string | null) => {
  if (!id) return null;

  const workspace = await prisma.tenant.findUnique({
    where: { id },
  });

  return workspace;
};

export const createTenant = async (
  tenantInput: Prisma.TenantCreateInput,
  user: Prisma.UserCreateInput
) => {
  if (!user.id) {
    throw new Error('Unauthorized');
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: tenantInput.name,
    },
  });

  await prisma.membership.create({
    data: {
      tenantId: tenant.id,
      userId: user.id,
      role: MembershipRole.OWNER,
      status: MembershipStatus.ACTIVE,
    },
  });

  return tenant;
};
