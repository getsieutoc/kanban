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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/lib/auth-client';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import Link from 'next/link';
import * as z from 'zod';

const formSchema = z
  .object({
    name: z.string(),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type Inputs = z.infer<typeof formSchema>;

export const SignupForm = () => {
  const [loading, startTransition] = useTransition();

  const defaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (inputs: Inputs) => {
    startTransition(async () => {
      await signUp.email(inputs);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <Button disabled={loading} className="ml-auto w-full" type="submit">
              Sign Up
            </Button>
          </div>
        </form>

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
