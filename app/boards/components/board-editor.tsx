'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Visibility } from '@prisma/client';

import { ReactNode, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBoard } from '@/actions/boards';
import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { clearCache } from '@/lib/cache';
import { toast } from 'sonner';
import * as z from 'zod';

const boardSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  visibility: z.nativeEnum(Visibility).default(Visibility.PUBLIC),
});

type FormInputs = z.infer<typeof boardSchema>;

type AddNewBoardProps = {
  trigger: ReactNode;
};

export const AddNewBoard = ({ trigger }: AddNewBoardProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { user } = useAuth();

  const defaultValues: FormInputs = useMemo(() => {
    return {
      title: '',
      description: '',
      visibility: Visibility.PUBLIC,
    };
  }, []);

  const form = useForm<FormInputs>({
    resolver: zodResolver(boardSchema),
    values: defaultValues,
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
      if (!user.activeTenantId) {
        throw new Error('User is not associated with a tenant');
      }

      const newBoard = await createBoard({
        ...input,
        tenant: { connect: { id: user.activeTenantId } },
      });

      if (newBoard) {
        console.log('New board created', newBoard);
        toast.success('Board created successfully');
        setOpen(false);
        clearCache('/boards');
      }
    } catch (_err) {
      toast.error('Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>Add New Board</DialogTitle>
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

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Description"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription></FormDescription>
                    </FormItem>
                  )}
                />

                <div className="flex w-full flex-col items-start gap-4 sm:flex-row">
                  <FormField
                    control={control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-1/2">
                        <FormLabel>Visibility</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-xs">
                              <SelectValue placeholder="Visibility" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(Visibility).map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="text-xs"
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
