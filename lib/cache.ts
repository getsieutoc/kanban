'use server';

import { revalidatePath } from 'next/cache';

export const clearCache = async (
  path?: string,
  options?: 'layout' | 'page'
) => {
  if (path) {
    revalidatePath(path, options);
  } else {
    revalidatePath('/', 'layout');
  }
};
