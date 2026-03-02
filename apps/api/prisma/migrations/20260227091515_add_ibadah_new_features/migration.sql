/*
  Warnings:

  - You are about to drop the column `catatan` on the `kelompok` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `kelompok` table. All the data in the column will be lost.
  - You are about to drop the column `jadwal` on the `kelompok` table. All the data in the column will be lost.
  - You are about to drop the column `ketua` on the `kelompok` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `kelompok` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `wilayah` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `wilayah` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jemaat" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "kelompok" DROP COLUMN "catatan",
DROP COLUMN "createdAt",
DROP COLUMN "jadwal",
DROP COLUMN "ketua",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "keterangan_kelompok" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "pendeta" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "wilayah" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ibadah_kelompok" (
    "id" TEXT NOT NULL,
    "judul" TEXT,
    "waktu" TIMESTAMP(3),
    "lokasi" TEXT,
    "keterangan" TEXT,
    "kelompok_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ibadah_kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ibadah_khusus" (
    "id" TEXT NOT NULL,
    "judul" TEXT,
    "waktu" TIMESTAMP(3),
    "lokasi" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ibadah_khusus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendalaman_alkitab" (
    "id" TEXT NOT NULL,
    "judul" TEXT,
    "waktu" TIMESTAMP(3),
    "lokasi" TEXT,
    "keterangan" TEXT,
    "pepanthan_id" TEXT,
    "wilayah_id" TEXT,
    "kelompok_id" TEXT,
    "komisi_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pendalaman_alkitab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ibadah_wilayah" (
    "id" TEXT NOT NULL,
    "judul" TEXT,
    "keterangan" TEXT,
    "lokasi" TEXT,
    "wilayah_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waktu" TIMESTAMP(3),

    CONSTRAINT "ibadah_wilayah_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ibadah_kelompok" ADD CONSTRAINT "ibadah_kelompok_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "kelompok"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendalaman_alkitab" ADD CONSTRAINT "pendalaman_alkitab_pepanthan_id_fkey" FOREIGN KEY ("pepanthan_id") REFERENCES "pepanthan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendalaman_alkitab" ADD CONSTRAINT "pendalaman_alkitab_wilayah_id_fkey" FOREIGN KEY ("wilayah_id") REFERENCES "wilayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendalaman_alkitab" ADD CONSTRAINT "pendalaman_alkitab_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "kelompok"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendalaman_alkitab" ADD CONSTRAINT "pendalaman_alkitab_komisi_id_fkey" FOREIGN KEY ("komisi_id") REFERENCES "komisi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ibadah_wilayah" ADD CONSTRAINT "ibadah_wilayah_wilayah_id_fkey" FOREIGN KEY ("wilayah_id") REFERENCES "wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
