'use client';

import { Plus, X } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createCard } from '@/actions/cards';
import { useAuth } from '@/hooks/use-auth';
import { useState, useRef, useEffect } from 'react';
import { clearCache } from '@/lib/cache';
import { toast } from 'sonner';

type AddCardButtonProps = {
  boardId: string;
  listId: string;
  totalCard: number;
};

export function AddNewCard({ boardId, listId, totalCard }: AddCardButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const onSubmit = async () => {
    if (!user || !title.trim()) return;

    setLoading(true);

    try {
      const newCard = await createCard({
        data: {
          title: title.trim(),
          order: totalCard,
          list: { connect: { id: listId } },
        },
      });

      if (newCard) {
        toast.success('Card created successfully');
        setTitle('');
        setIsEditing(false);
        clearCache(`/boards/${boardId}`);
      }
    } catch (_err) {
      toast.error('Failed to create card');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle('');
    }
  };

  if (isEditing) {
    return (
      <div className="p-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a title for this card..."
          disabled={loading}
        />
        <div className="mt-2 flex items-center gap-2">
          <Button
            onClick={onSubmit}
            disabled={!title.trim() || loading}
            size="sm"
          >
            {loading ? 'Adding...' : 'Add card'}
          </Button>
          <Button
            onClick={() => {
              setIsEditing(false);
              setTitle('');
            }}
            variant="ghost"
            size="sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={() => setIsEditing(true)}
      className="flex h-full w-full shrink-0 cursor-pointer items-center justify-center p-2"
    >
      <div className="text-muted-foreground flex items-center gap-1 text-sm">
        <Plus className="h-4 w-4" />
        <span>Add new card</span>
      </div>
    </Card>
  );
}
