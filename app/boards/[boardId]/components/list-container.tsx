'use client';

import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { List } from '@/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { AlertModal } from '@/components/common/alert-modal';
import { deleteList } from '@/actions/lists';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ListContainerProps = {
  id: string;
  list: List;
  children?: React.ReactNode;
};

export function ListContainer({ id, list, children }: ListContainerProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteList(id);
      // List will be removed from UI through revalidation
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Droppable droppableId={`${id}`}>
        {(provided, _snapshot) => (
          <Card
            ref={provided.innerRef}
            className="h-full w-64 shrink-0 p-2"
            {...provided.droppableProps}
          >
            <div className="mb-2 px-2 flex items-center justify-between">
              <h3 className="text-sm font-medium">{list.title}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex min-h-[50px] flex-col gap-2">
              {children}
            </div>
          </Card>
        )}
      </Droppable>

      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete List"
        description="Are you sure you want to delete this list? This will also delete all cards within this list and cannot be undone."
      />
    </>
  );
}
