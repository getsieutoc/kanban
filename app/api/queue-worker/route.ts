import type { CardOperation, ColumnOperation } from '@/lib/queue-operations';
import { QUEUE_KEYS, queueOperations } from '@/lib/queue-operations';
import { reorderColumn } from '@/actions/columns';
import { reorderCard } from '@/actions/cards';
import { NextResponse } from 'next/server';
import { clearCache } from '@/lib/cache';

// Maximum retries for failed operations
const MAX_RETRIES = 3;

// Process card operations
async function processCardOperation(operation: CardOperation) {
  try {
    // Mark as processing
    await queueOperations.markAsProcessing(operation.id);

    // Perform the database update
    await reorderCard({
      id: operation.cardId,
      columnId: operation.columnId,
      order: operation.order,
    });

    // Clear cache for the affected board
    await clearCache(`/boards/${operation.boardId}`);

    // Remove from processing set
    await queueOperations.removeFromProcessing(operation.id);

    return true;
  } catch (error) {
    console.error(`Error processing card operation ${operation.id}:`, error);

    // Remove from processing
    await queueOperations.removeFromProcessing(operation.id);

    // Handle retries
    if ((operation.retries || 0) < MAX_RETRIES) {
      await queueOperations.requeueWithRetry(operation, QUEUE_KEYS.CARD);
    } else {
      await queueOperations.moveToFailed(operation);
    }

    return false;
  }
}

// Process column operations
async function processColumnOperation(operation: ColumnOperation) {
  try {
    // Mark as processing
    await queueOperations.markAsProcessing(operation.id);

    // Perform the database update
    await reorderColumn({
      id: operation.columnId,
      order: operation.order,
    });

    // Clear cache for the affected board
    await clearCache(`/boards/${operation.boardId}`);

    // Remove from processing set
    await queueOperations.removeFromProcessing(operation.id);

    return true;
  } catch (error) {
    console.error(`Error processing column operation ${operation.id}:`, error);

    // Remove from processing
    await queueOperations.removeFromProcessing(operation.id);

    // Handle retries
    if ((operation.retries || 0) < MAX_RETRIES) {
      await queueOperations.requeueWithRetry(operation, QUEUE_KEYS.COLUMN);
    } else {
      await queueOperations.moveToFailed(operation);
    }

    return false;
  }
}

// Process a batch of operations
export async function POST() {
  const results = {
    cards: { processed: 0, failed: 0 },
    columns: { processed: 0, failed: 0 },
  };

  try {
    // Process card operations (up to 10 at a time)
    for (let i = 0; i < 10; i++) {
      const operation = await queueOperations.getNextOperation(QUEUE_KEYS.CARD);
      if (!operation) break;

      const success = await processCardOperation(operation as CardOperation);
      if (success) {
        results.cards.processed++;
      } else {
        results.cards.failed++;
      }
    }

    // Process column operations (up to 10 at a time)
    for (let i = 0; i < 10; i++) {
      const operation = await queueOperations.getNextOperation(
        QUEUE_KEYS.COLUMN
      );
      if (!operation) break;

      const success = await processColumnOperation(
        operation as ColumnOperation
      );
      if (success) {
        results.columns.processed++;
      } else {
        results.columns.failed++;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing queue:', error);
    return NextResponse.json(
      { error: 'Failed to process queue' },
      { status: 500 }
    );
  }
}
