import { Prisma } from '@prisma/client';
import { type SearchParams } from 'nuqs';
import { type ReactNode } from 'react';

import { userIncludes } from '@/lib/rich-includes';

export * from '@prisma/client';

export type LayoutProps = {
  children: ReactNode;
};

export type DynamicRouteParams = Record<string, string | string[]>;

export type PageProps<T = DynamicRouteParams> = {
  searchParams: Promise<SearchParams>;
  params: Promise<T>;
};

export type Maybe<T> = NonNullable<T> | undefined;

export type UnknowData = Record<string, unknown>;

export enum HttpMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

export type SelectedTrack = {
  track: Track;
  signedUrl?: string;
};

export type SelectedAlbum = {
  album: Album;
  // signedUrl?: string;
};

export type SelectedPlaylist = {
  playlist: Playlist;
  // signedUrl?: string;
};

export type UploadedFile = {
  name: string;
  size: number;
};

export type UserWithPayload = Prisma.UserGetPayload<{
  include: typeof userIncludes;
}>;

export type UploadProgress = {
  progress: number;
  status: 'uploading' | 'complete';
};