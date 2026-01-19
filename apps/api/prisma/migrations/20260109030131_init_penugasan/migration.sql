/*
  Warnings:

  - You are about to drop the column `type` on the `banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banners" DROP COLUMN "type";

-- DropEnum
DROP TYPE "BannerType";

-- CreateTable
CREATE TABLE "penugasan" (
    "id" TEXT NOT NULL,
    "pelayanan_id" TEXT NOT NULL,
    "petugas_id" TEXT NOT NULL,
    "peran_dalam_pelayanan" TEXT NOT NULL,
    "tanggal_mulai_penugasan" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai_penugasan" TIMESTAMP(3),
    "jadwal_tugas" TEXT,
    "status_penugasan" TEXT NOT NULL DEFAULT 'AKTIF',
    "evaluasi_kinerja" TEXT,
    "catatan_penugasan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penugasan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "penugasan" ADD CONSTRAINT "penugasan_pelayanan_id_fkey" FOREIGN KEY ("pelayanan_id") REFERENCES "pelayanan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penugasan" ADD CONSTRAINT "penugasan_petugas_id_fkey" FOREIGN KEY ("petugas_id") REFERENCES "jemaat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
