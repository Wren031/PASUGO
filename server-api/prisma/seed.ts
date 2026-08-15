import { PrismaClient, AccountStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const users = [
  {
    email: 'admin@hatodgo.ph',
    password: 'admin123',
    name: 'HatodGo Admin',
    role: Role.admin,
    status: AccountStatus.Active,
  },
  {
    email: 'passenger@hatodgo.ph',
    password: 'hatodgo123',
    name: 'Demo Passenger',
    role: Role.passenger,
    status: AccountStatus.Active,
  },
  {
    email: 'driver@hatodgo.ph',
    password: 'hatodgo123',
    name: 'Demo Driver',
    role: Role.driver,
    status: AccountStatus.Active,
  },
];

async function main() {
  const saltRounds = 12;

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existing) {
      console.log(`seed: ${user.email} already exists, skipping`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: user.email,
        passwordHash: await bcrypt.hash(user.password, saltRounds),
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });

    console.log(`seed: created ${user.email} (${user.role})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });