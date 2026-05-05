import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "dev@example.com" },
    update: {},
    create: {
      email: "dev@example.com",
      password,
      name: "Dev User",
    },
  });

  console.log("✅ User créé:", user.email);

  await prisma.note.createMany({
    data: [
      {
        title: "Commande Git utiles",
        content: `# Commandes Git utiles\n\n## Annuler le dernier commit\n\`\`\`bash\ngit reset --soft HEAD~1\n\`\`\`\n\n## Rebaser sur main\n\`\`\`bash\ngit fetch origin && git rebase origin/main\n\`\`\``,
        userId: user.id,
      },
      {
        title: "Notes JavaScript",
        content: `# Tips JavaScript\n\n## Optional chaining\n\`\`\`js\nconst name = user?.profile?.name ?? 'Anonymous';\n\`\`\`\n\n## Array destructuring\n\`\`\`js\nconst [first, ...rest] = array;\n\`\`\``,
        userId: user.id,
      },
      {
        title: "Idées de projet",
        content: `# Idées de projet\n\n- [ ] App de gestion de notes ✅\n- [ ] Dashboard météo\n- [ ] CLI pour générer des composants\n- [ ] Bot Discord pour rappels`,
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Notes de test créées");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
