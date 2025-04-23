'use client';

import { getAllUploadProgresses } from '@/actions/upload';
import { uploadIdAtom } from '@/lib/atoms';
import { hasUploadFinished } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';

export const PurgeUploadId = () => {
  const [uploadId, setUploadId] = useAtom(uploadIdAtom);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!uploadId) return;

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(async () => {
      try {
        const uploads = await getAllUploadProgresses(uploadId);

        if (hasUploadFinished(uploads)) {
          // Stop polling when complete or on error
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
            setUploadId(null); // Clear uploadId when finished
            console.log('--- Cleared uploadId');
          }
        }
      } catch (err) {
        // setError(err as Error)
      }
    }, 600);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [uploadId]);

  return null;
};
