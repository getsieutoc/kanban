import { NextResponse, type NextRequest } from 'next/server';
import queueOperations from '@/lib/queue-operations';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = await queueOperations.enqueueCardUpdate(data);
    
    // Process the queue immediately after enqueueing
    await fetch(new URL('/api/queue-worker', request.url), { method: 'POST' });
    
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error('Failed to enqueue card update:', error);
    return NextResponse.json(
      { error: 'Failed to enqueue card update' },
      { status: 500 }
    );
  }
}
