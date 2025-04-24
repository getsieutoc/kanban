'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useAtom } from 'jotai';
import useSWR from 'swr';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuDialogItem,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { currentWorkspaceAtom } from '@/lib/atoms';
import { AddWorkspaceForm } from '@/components/common/add-workspace-form';

import { Workspace } from '@/types/workspace';

async function fetchWorkspaces(): Promise<Workspace[]> {
  const res = await fetch('/api/me/tenants');
  if (!res.ok) throw new Error('Failed to fetch workspaces');
  return res.json();
}

export function WorkspaceSwitcher() {
  const [currentWorkspace, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const { data: workspaces, error } = useSWR<Workspace[]>(
    '/api/me/tenants',
    fetchWorkspaces,
    {
      revalidateOnFocus: false
    }
  );

  if (error) return null;
  if (!workspaces) return null;

  return (
        <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {currentWorkspace?.name?.[0] || '?'}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {currentWorkspace?.name || 'Select Workspace'}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
             </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side='bottom'
            sideOffset={4}
          >
            {workspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => setCurrentWorkspace(workspace)}
                className='gap-2 p-2'
              >
                <div className='flex size-6 items-center justify-center rounded-sm border'>
                  {workspace.name[0]}
                </div>
                {workspace.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuDialogItem
              trigger={
                <div className='gap-2 p-2'>
                  <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                    <Plus className='size-4' />
                  </div>
                  <div className='font-medium text-muted-foreground'>Add workspace</div>
                </div>
              }
              onSelect={(e) => {
                e.preventDefault();
                setIsDialogOpen(true);
              }}
            >
              <DialogHeader>
                <DialogTitle>Create workspace</DialogTitle>
                <DialogDescription>
                  Add a new workspace to organize your boards.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <AddWorkspaceForm 
                  onSuccess={(workspace) => {
                    setCurrentWorkspace(workspace);
                    setIsDialogOpen(false);
                  }}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </div>
            </DropdownMenuDialogItem>
          </DropdownMenuContent>
        </DropdownMenu>
  );
}
