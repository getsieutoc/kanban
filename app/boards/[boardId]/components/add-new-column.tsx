'use client';

import { createColumn } from '@/actions/columns';
import { Plus } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { clearCache } from '@/lib/cache';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const columnSchema = z.object({
  title: z.string().default(''),
  order: z.number().default(0),
});

type FormInputs = z.infer<typeof columnSchema>;

type AddNewColumnProps = {
  boardId: string;
  totalColumn: number;
};

export const AddNewColumn = ({ boardId, totalColumn }: AddNewColumnProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const form = useForm<FormInputs>({
    resolver: zodResolver(columnSchema),
    values: {
      title: '',
      order: totalColumn,
    },
  });

  const {
    control,
    // register,
    // handleSubmit,
    // reset,
    // trigger,
    // setError,
    // getValues,
    // setValue,
    formState: { isDirty },
  } = form;

  const onSubmit = async (input: FormInputs) => {
    if (!user) {
      toast.error('User not authenticated or something wrong.');
      return;
    }

    setLoading(true);

    try {
      const newColumn = await createColumn({
        data: {
          ...input,
          order: totalColumn,
          board: { connect: { id: boardId } },
        },
      });

      if (newColumn) {
        console.log('New column created', newColumn);
        toast.success('Column created successfully');
        setOpen(false);
        clearCache(`/boards/${boardId}`);
      }
    } catch {
      toast.error('Failed to create column');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="flex w-64 shrink-0 cursor-pointer items-center justify-center p-2">
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Plus className="h-4 w-4" />
            <span>Add another column</span>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Add New Column</DialogTitle>
              <DialogDescription>Fill in details</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-8">
              <div className="mb-4 flex w-full flex-col items-start gap-4">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription></FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-end">
              <Button disabled={!isDirty || loading} type="submit">
                {loading ? 'Creating...' : 'Create'}
              </Button>

              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
