import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';
import { isAuthPath } from '@/lib/utils';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma-client';
import { headers } from 'next/headers';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log('Signed Up', { request, url, token });

      await sendEmail({
        to: user.email,
        subject: 'Verify Kanban Account',
        content: `<a href="${url}">Click here to verify your account</a>`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: ['sieutoc-Kanban://'],
  user: {
    additionalFields: {
      activeProfileId: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
        fieldName: 'activeProfileId',
      },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // DEBUG:
      // console.log({ path: ctx.path, newSession: ctx.context.newSession });
      // Only execute this at early stage of registration
      if (isAuthPath(ctx.path) && ctx.context.newSession) {
        const { user } = ctx.context.newSession;

        if (user && !user.activeProfileId) {
          const newProfile = await prisma.profile.create({
            data: {
              name: 'Default',
              userId: user.id,
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { activeProfileId: newProfile.id },
          });
        }
      }
    }),
  },
  plugins: [
    expo(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // console.log('Magic', { request, url, token });
        // const expourl = `sieutoc-Kanban://new/api/auth/magic-link/verify?token=${token}`;
        // console.log('expourl', expourl);

        await sendEmail({
          to: email,
          subject: 'Login to Kanban',
          // TODO: Make the email template asap
          content: `<a href="${url}">Click here to login</a>`,
        });
      },
    }),
    nextCookies(), // make sure this is the last plugin in the array
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
});

// NOTE: This is the way we get session in server components
// Try to make the return look closer to useAuth
export const getAuth = async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
    query: {
      disableCookieCache: true,
    },
  });

  if (!data) {
    return {
      session: null,
      user: null,
      profile: null,
    };
  }

  const { user } = data;

  if (!user.activeProfileId) {
    throw new Error('Can not get active profile ID');
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.activeProfileId },
  });

  return {
    ...data,
    profile,
  };
};
