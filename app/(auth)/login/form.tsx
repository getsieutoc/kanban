'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/separator';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import Link from 'next/link';
import * as z from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
});

type Inputs = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('back');

  const [loading, startTransition] = useTransition();

  const defaultValues = {
    email: '',
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (inputs: Inputs) => {
    startTransition(async () => {
      await signIn.magicLink({
        email: inputs.email,
        callbackURL: callbackUrl ?? '/boards',
      });
    });
  };

  return (
    <Form {...form}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Getting Started
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to get started
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email..."
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Button disabled={loading} className="ml-auto w-full" type="submit">
              Login by Magic Link
            </Button>
          </div>
        </form>

        <Separator className="w-full" />

        <p className="text-muted-foreground px-8 text-center text-xs">
          By clicking continue, you agree to our{' '}
          <Link
            href="/terms"
            className="hover:text-primary underline underline-offset-4"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="hover:text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </Form>
  );
};
