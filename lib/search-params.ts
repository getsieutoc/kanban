import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString,
} from 'nuqs/server';

export const searchParams = {
  skip: parseAsInteger.withDefault(0),
  take: parseAsInteger.withDefault(20),
  q: parseAsString,
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
