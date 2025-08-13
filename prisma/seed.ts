// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o script de seed...");

  const adminEmail = 'admin@admin.com';
  const plainPassword = ''; // 👈 TROQUE AQUI POR UMA SENHA FORTE

  // Verifica se o usuário administrador já existe para não criar duplicatas
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Usuário administrador com o email '${adminEmail}' já existe. Nenhuma ação foi tomada.`);
  } else {
    // Criptografa a senha antes de salvar no banco
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Cria o novo usuário administrador
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrador Principal',
        password: hashedPassword,
        role: UserRole.ADMIN, // Garante que a função seja ADMIN
      },
    });
    console.log("✅ Usuário administrador criado com sucesso!");
    console.log(`   - Email: ${adminUser.email}`);
    console.log(`   - Role: ${adminUser.role}`);
  }

  console.log("Script de seed finalizado.");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar o script de seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });