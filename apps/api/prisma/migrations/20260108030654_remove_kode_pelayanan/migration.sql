/*
  Warnings:

  - You are about to drop the column `kode_pelayanan` on the `pelayanan` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "pelayanan_kode_pelayanan_key";

-- AlterTable
ALTER TABLE "pelayanan" DROP COLUMN "kode_pelayanan";
