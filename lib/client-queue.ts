import { clientQueueOperations } from './client-queue-operations';

// In-memory storage for debouncing
const debounceTimers: Record<string, NodeJS.Timeout> = {};
const DEBOUNCE_TIME = 500; // ms

export const clientQueue = {
  // Add card update with debouncing
  addCardUpdate: (data: {
    cardId: string;
    columnId: string;
    order: number;
  }) => {
    const operationKey = `card-${data.cardId}-${data.columnId}`;

    // Clear existing timeout for same operation
    if (debounceTimers[operationKey]) {
      clearTimeout(debounceTimers[operationKey]);
    }

    // Debounce the operation
    debounceTimers[operationKey] = setTimeout(async () => {
      try {
        await clientQueueOperations.enqueueCardUpdate(data);
      } catch (error) {
        console.error('Failed to queue card update:', error);
      } finally {
        delete debounceTimers[operationKey];
      }
    }, DEBOUNCE_TIME);
  },

  // Add column update with debouncing
  addColumnUpdate: (data: {
    boardId: string;
    columnId: string;
    order: number;
  }) => {
    const operationKey = `column-${data.columnId}`;

    // Clear existing timeout for same operation
    if (debounceTimers[operationKey]) {
      clearTimeout(debounceTimers[operationKey]);
    }

    // Debounce the operation
    debounceTimers[operationKey] = setTimeout(async () => {
      try {
        await clientQueueOperations.enqueueColumnUpdate(data);
      } catch (error) {
        console.error('Failed to queue column update:', error);
      } finally {
        delete debounceTimers[operationKey];
      }
    }, DEBOUNCE_TIME);
  },

  // Clear all pending debounced operations
  clearPending: () => {
    Object.values(debounceTimers).forEach((timer) => clearTimeout(timer));
    Object.keys(debounceTimers).forEach((key) => delete debounceTimers[key]);
  },
};
