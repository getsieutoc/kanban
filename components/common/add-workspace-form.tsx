'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tenant, Prisma } from '@/types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
}) satisfies z.ZodType<Prisma.TenantCreateInput>;

interface AddWorkspaceFormProps {
  onSuccess?: (workspace: Tenant) => void;
  onCancel?: () => void;
}

export function AddWorkspaceForm({
  onSuccess,
  onCancel,
}: AddWorkspaceFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<Prisma.TenantCreateInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: Prisma.TenantCreateInput) {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }

      const workspace = await response.json();
      toast.success('Workspace created successfully');
      onSuccess?.(workspace);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter workspace name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
