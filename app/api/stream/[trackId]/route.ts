import { getSignedUrl } from '@/actions/upload';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma-client';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ trackId: string }> }
) {
  const params = await props.params;
  try {
    const { trackId } = params;

    if (!trackId) {
      return NextResponse.json({ error: 'Track ID required' }, { status: 400 });
    }

    const track = await prisma.track.findUniqueOrThrow({
      where: { id: trackId },
    });

    const signedUrl = await getSignedUrl(track.filename);

    if (!signedUrl) {
      return NextResponse.json(
        { error: 'Failed to get signed URL' },
        { status: 500 }
      );
    }

    const response = await fetch(signedUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch the file' },
        { status: 500 }
      );
    }

    const readableStream = response.body;

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
        'Content-Disposition': `inline; filename="${track.filename}"`,
      },
    });
  } catch (error) {
    console.error('Streaming error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
