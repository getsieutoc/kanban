import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { customAlphabet } from 'nanoid';
import { UploadProgress } from '@/types';

export const nanoid = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyz',
  16
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytes')
      : (sizes[i] ?? 'Bytes')
  }`;
}

export function extractFileName(filename: string) {
  const parts = filename.split('.');
  const extension = parts.pop();

  if (!extension) {
    throw new Error('File has no extension!');
  }

  const name = parts.join('.');

  return { name, extension };
}

export function isAuthPath(path: string) {
  return ['/magic-link/verify', '/callback', '/sign-up/email'].some((prefix) =>
    path.startsWith(prefix)
  );
}

export function getAudio(file: File): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);

    audio.onloadedmetadata = () => {
      resolve(audio);
    };

    audio.onerror = (error) => {
      URL.revokeObjectURL(audio.src);
      reject(error);
    };
  });
}
export function getContentType(extension?: string) {
  switch (extension) {
    case 'wav':
      return 'audio/wav';
    case 'mp3':
      return 'audio/mpeg';
    case 'ogg':
      return 'audio/ogg';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Helper function to format Server-Sent Events (SSE) messages
 * @param event - Event name
 * @param data - Data payload
 * @returns Encoded SSE string
 */
export function encodeSSE(event: string, data: string | number): Uint8Array {
  return new TextEncoder().encode(`event: ${event}\ndata: ${data}\n\n`);
}

/*
 * Safe and simple enough helper to check if an object is empty
 */
export function isObjectEmpty(value: unknown) {
  if (typeof value !== 'object' || !value) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  if (proto !== null && proto !== Object.prototype) {
    return false;
  }

  return Object.keys(value).length === 0;
}

export function hasUploadFinished(p: Record<string, UploadProgress>) {
  return (
    !isObjectEmpty(p) && Object.values(p).every((p) => p.status === 'complete')
  );
}

export function isFileWithPreview(
  file: File
): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}