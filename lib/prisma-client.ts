import { PrismaClient } from '@/types';

declare global {
  // We need var in declare global
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

// const omitConfig = {
//   user: {
//     hashedPassword: true,
//   },
// } satisfies Prisma.GlobalOmitConfig;

const prismaClientSingleton = () => {
  return new PrismaClient({
    // omit: omitConfig, // comment it off if you want to omit some fields
  });
};

export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;

const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma, PrismaClient };
