import { prisma } from '@/lib/prisma-client';
import { NextResponse } from 'next/server';
import { getAuth } from '@/auth';

export async function GET() {
  try {
    const { session } = await getAuth();

    if (!session) {
      return NextResponse.json(null, { status: 201 });
    }

    // TODO: Should we add activeProfileId into session so we can avoid this query?
    const foundUser = await prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
    });

    if (!foundUser || !foundUser.activeProfileId) {
      return NextResponse.json(null, { status: 201 });
    }

    const foundProfile = await prisma.profile.findUnique({
      where: { id: foundUser.activeProfileId },
    });

    return NextResponse.json(foundProfile, { status: 200 });
  } catch (_err) {
    return NextResponse.json(
      { success: false, message: 'Can not get my profile data' },
      { status: 500 }
    );
  }
}
