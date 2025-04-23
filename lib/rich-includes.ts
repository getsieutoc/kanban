export const tenantIncludes = {
  projects: {
    where: { deletedAt: null },
  },
  memberships: {
    select: {
      id: true,
      role: true,
      status: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};

export const userIncludes = {
  memberships: {
    select: {
      id: true,
      tenantId: true,
      status: true,
    },
  },
};
