const { PrismaClient, Prisma } = require("@prisma/client");

const prisma = new PrismaClient().$extends({
  model: {
    $allModels: {
      async exists(where) {
        const context = Prisma.getExtensionContext(this);
        const result = await context.findFirst({ where });
        return result !== null;
      },
      async existsUnique(where) {
        const context = Prisma.getExtensionContext(this);
        const result = await context.findUnique({ where });
        return result !== null;
      },
    },
  },
});

module.exports = prisma;
