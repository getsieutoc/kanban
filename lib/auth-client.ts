import {
  magicLinkClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { auth } from '@/auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
