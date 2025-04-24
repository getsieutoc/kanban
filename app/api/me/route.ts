import { userIncludes } from '@/lib/rich-includes';
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

    if (!user) {
      return NextResponse.json(null, { status: 201 });
    }

    // Then get the user data with their active tenant and boards
    const userData = await prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
      include: userIncludes,
    });

    return NextResponse.json(userData, { status: 200 });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Can not get my profile data' },
      { status: 500 }
    );
  }
}
