import { HttpMethod } from '@/types';

// Client-side queue operations that communicate with the server via API
export const clientQueueOperations = {
  // Add a card update to the queue
  enqueueCardUpdate: async (operation: {
    cardId: string;
    columnId: string;
    order: number;
  }) => {
    const response = await fetch('/api/queue/card', {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operation),
    });

    if (!response.ok) {
      throw new Error('Failed to enqueue card update');
    }

    const data = await response.json();
    return data.id;
  },

  // Add a column update to the queue
  enqueueColumnUpdate: async (operation: {
    columnId: string;
    order: number;
    boardId: string;
  }) => {
    const response = await fetch('/api/queue/column', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(operation),
    });

    if (!response.ok) {
      throw new Error('Failed to enqueue column update');
    }

    const data = await response.json();
    return data.id;
  },
};
