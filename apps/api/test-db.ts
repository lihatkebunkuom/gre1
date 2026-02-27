import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const jemaat = await prisma.jemaat.findMany({
      include: { wilayah: true, kelompok: true },
      orderBy: { nama: 'asc' },
    });
    console.log("Success:", jemaat.length);
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();