import { type SearchParams } from 'nuqs';
import { type ReactNode } from 'react';
import { Prisma } from '@/types';

import { cardIncludes, userIncludes } from '@/lib/rich-includes';
import { getColumnsFromBoard } from '@/actions/columns';

export type { ReactNode, Component } from 'react';

export * from '@/prisma/client';

export const blockBoardPanningAttr = 'data-block-board-panning' as const;

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

export type CardWithPayload = Prisma.CardGetPayload<{
  include: typeof cardIncludes;
}>;

export type ColumnWithPayload = Awaited<
  ReturnType<typeof getColumnsFromBoard>
>[0];

export type UserWithPayload = Prisma.UserGetPayload<{
  include: typeof userIncludes;
}>;
