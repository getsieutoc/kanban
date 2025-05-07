import { nanoid } from 'nanoid';
import { redis } from './redis-client';

// Queue keys in Redis
export const QUEUE_KEYS = {
  CARD: 'queue:card:updates',
  COLUMN: 'queue:column:updates',
  PROCESSING: 'set:processing',
  FAILED: 'queue:failed',
} as const;

// Types
export type CardOperation = {
  id: string;
  cardId: string;
  columnId: string;
  order: number;
  boardId: string;
  timestamp: number;
  retries?: number;
};

export type ColumnOperation = {
  id: string;
  columnId: string;
  order: number;
  boardId: string;
  timestamp: number;
  retries?: number;
};

// Queue operations
export const queueOperations = {
  // Add a card update to the queue
  enqueueCardUpdate: async (
    operation: Omit<CardOperation, 'id' | 'timestamp' | 'retries'>
  ) => {
    const id = nanoid();
    const fullOperation: CardOperation = {
      ...operation,
      id,
      timestamp: Date.now(),
      retries: 0,
    };

    // Serialize and add to Redis
    await redis.lpush(QUEUE_KEYS.CARD, JSON.stringify(fullOperation));

    return id;
  },

  // Add a column update to the queue
  enqueueColumnUpdate: async (
    operation: Omit<ColumnOperation, 'id' | 'timestamp' | 'retries'>
  ) => {
    const id = nanoid();
    const fullOperation: ColumnOperation = {
      ...operation,
      id,
      timestamp: Date.now(),
      retries: 0,
    };

    // Serialize and add to Redis
    await redis.lpush(QUEUE_KEYS.COLUMN, JSON.stringify(fullOperation));

    return id;
  },

  // Get next operation from queue
  getNextOperation: async (queueKey: string) => {
    const item = await redis.rpop(queueKey);
    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch (error) {
      console.error('Failed to parse queue item:', error);
      return null;
    }
  },

  // Mark operation as processing
  markAsProcessing: async (operationId: string) => {
    await redis.sadd(QUEUE_KEYS.PROCESSING, operationId);
  },

  // Remove operation from processing
  removeFromProcessing: async (operationId: string) => {
    await redis.srem(QUEUE_KEYS.PROCESSING, operationId);
  },

  // Move operation to failed queue
  moveToFailed: async (operation: CardOperation | ColumnOperation) => {
    await redis.lpush(
      QUEUE_KEYS.FAILED,
      JSON.stringify({
        ...operation,
        failedAt: Date.now(),
      })
    );
  },

  // Requeue operation with incremented retry count
  requeueWithRetry: async (
    operation: CardOperation | ColumnOperation,
    queueKey: string
  ) => {
    const updatedOperation = {
      ...operation,
      retries: (operation.retries || 0) + 1,
      timestamp: Date.now(),
    };

    await redis.lpush(queueKey, JSON.stringify(updatedOperation));
  },

  // Clear all queues (useful for testing/debugging)
  clearQueues: async () => {
    await Promise.all([
      redis.del(QUEUE_KEYS.CARD),
      redis.del(QUEUE_KEYS.COLUMN),
      redis.del(QUEUE_KEYS.PROCESSING),
      redis.del(QUEUE_KEYS.FAILED),
    ]);
  },
};

export default queueOperations;
