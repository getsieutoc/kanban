import { NextResponse } from 'next/server';
import { Workspace } from '@/types/workspace';

import { prisma } from '@/lib/prisma-client';
import { getAuth } from '@/auth';

export async function GET() {
  try {
    const session = await getAuth();
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        memberships: {
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Transform the data to return just the tenants
    const tenants: Workspace[] = user.memberships.map((membership) => ({
      id: membership.tenant.id,
      name: membership.tenant.name,
    }));

    return NextResponse.json(tenants);
  } catch (error) {
    console.error('[TENANTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
