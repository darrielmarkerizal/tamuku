import pkg from './src/generated/prisma/default.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ take: 3, select: { username: true } });
  console.log("Users:", users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
