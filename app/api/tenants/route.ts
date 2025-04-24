import { Workspace, CreateWorkspaceInput } from '@/types/workspace';
import { MembershipRole, MembershipStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma-client';
import { NextResponse } from 'next/server';
import { getAuth } from '@/auth';
import { z } from 'zod';

const createTenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
}) satisfies z.ZodType<CreateWorkspaceInput>;

export async function POST(req: Request) {
  try {
    const session = await getAuth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = createTenantSchema.parse(json);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Create tenant and membership in a transaction
    const result: Workspace = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: body.name,
        },
      });

      const membership = await tx.membership.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: MembershipRole.OWNER,
          status: MembershipStatus.ACTIVE,
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return membership.tenant;
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 422 });
    }

    console.error('[TENANT_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
