import { prisma } from '@/lib/prisma-client';
import { NextResponse } from 'next/server';
import { getAuth } from '@/auth';

export async function GET() {
  try {
    const { session } = await getAuth();

    if (!session) {
      return NextResponse.json(null, { status: 201 });
    }

    // First get the user to check their active tenant
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
    });

    if (!user || !user.activeTenantId) {
      return NextResponse.json(null, { status: 201 });
    }

    // Then get the user data with their active tenant and boards
    const userData = await prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
      include: {
        memberships: {
          where: { tenantId: user.activeTenantId },
          include: {
            tenant: {
              include: {
                boards: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(userData, { status: 200 });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Can not get my profile data' },
      { status: 500 }
    );
  }
}
