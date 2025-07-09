import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'user@exemplo.com';
  const plainPassword = 'senha';

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    console.log(`Usuário com email ${email} já existe.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: email,
      name: 'Administrador',
      password: hashedPassword,
      role: UserRole.ADMIN, // Garante que ele seja um ADMIN
    },
  });

  console.log(`✅ Usuário administrador criado com sucesso!`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });