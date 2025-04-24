import { Prisma } from '@prisma/client';
import { type SearchParams } from 'nuqs';
import { type ReactNode } from 'react';

import { userIncludes } from '@/lib/rich-includes';
import { getListsFromBoard } from '@/actions/lists';

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

export type ListWithPayload = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  order: number;
  boardId: string;
  cards: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string | null;
    order: number;
    dueDate: Date | null;
    listId: string;
    assignees: any[];
    labels: {
      label: any;
    }[];
  }[];
};

export type UserWithPayload = Prisma.UserGetPayload<{
  include: typeof userIncludes;
}>;
