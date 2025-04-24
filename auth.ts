import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';
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
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify Kanban Account',
        content: `<a href="${url}">Click here to verify your account</a>`,
      });
    },
  },
  user: {
    additionalFields: {
      activeTenantId: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: false,
        fieldName: 'activeTenantId',
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
        console.log('### user: ', user);

        if (user && !user.activeTenantId) {
          const newTenant = await prisma.tenant.create({
            data: {
              name: 'Default Workspace',
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: {
              activeTenantId: newTenant.id,
            },
          });
        }
      }
    }),
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
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

  return {
    ...data,
  };
};
