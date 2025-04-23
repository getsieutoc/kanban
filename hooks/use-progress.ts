import { getAllUploadProgresses } from '@/actions/upload';
import { useEffect, useRef, useState } from 'react';
import { UploadProgress } from '@/types';
import { hasUploadFinished } from '@/lib/utils';

export function useProgress(uploadId: string | null) {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const [progress, setProgress] = useState<Record<string, UploadProgress>>({});

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!uploadId) return;

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        setIsLoading(true);
        const uploads = await getAllUploadProgresses(uploadId);

        setProgress(uploads);

        if (hasUploadFinished(uploads)) {
          // Stop polling when complete or on error
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            console.log('--- Polling stopped');
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [uploadId]);

  return { progress, isLoading, error };
}
