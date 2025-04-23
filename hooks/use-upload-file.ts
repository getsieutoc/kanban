'use client';

import { HttpMethod, type UploadedFile } from '@/types';

import { getErrorMessage } from '@/lib/handle-error';
import { useState } from 'react';
import { toast } from 'sonner';

export type UseUploadFileOptions = {
  onUploadBegin?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  defaultUploadedFiles?: UploadedFile[];
  skipPolling?: boolean;
};

export function useUploadFile({
  defaultUploadedFiles: defaultUploaded = [],
}: UseUploadFileOptions = {}) {
  const [uploadedFiles, setUploadedFiles] = useState(defaultUploaded);

  const [progresses, setProgresses] = useState<Record<string, number>>({});

  const [isUploading, setIsUploading] = useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);

    try {
      const formData = new FormData();

      for (const file of files) {
        formData.append('files', file);
      }

      const response = await fetch('/api/upload', {
        method: HttpMethod.POST,
        body: formData,
      });

      return await response.json();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
