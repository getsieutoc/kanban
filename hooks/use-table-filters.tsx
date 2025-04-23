'use client';

import { searchParams } from '@/lib/search-params';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

export function useTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );

  const [skip, setSkip] = useQueryState(
    'skip',
    searchParams.skip.withDefault(0)
  );

  const [take, setTake] = useQueryState(
    'take',
    searchParams.take.withDefault(10)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setSkip(0);
    setTake(1);
  }, [setSearchQuery, setTake, setSkip]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery;
  }, [searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    skip,
    setSkip,
    take,
    setTake,
    resetFilters,
    isAnyFilterActive,
  };
}
