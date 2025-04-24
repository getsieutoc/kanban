import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const uploadIdAtom = atom<string | null>(null);

import { Workspace } from '@/types/workspace';

export const currentWorkspaceAtom = atomWithStorage<Workspace | null>('currentWorkspace', null);
