-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SEKRETARIS', 'BENDAHARA', 'GEMBALA', 'JEMAAT');

-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "StatusKeanggotaan" AS ENUM ('TETAP', 'TITIPAN', 'TAMU');

-- CreateEnum
CREATE TYPE "StatusPernikahan" AS ENUM ('BELUM_MENIKAH', 'MENIKAH', 'CERAI_HIDUP', 'CERAI_MATI');

-- CreateEnum
CREATE TYPE "StatusSakramen" AS ENUM ('SUDAH', 'BELUM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'JEMAAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wilayah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelompok" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "ketua" TEXT,
    "jadwal" TEXT,
    "catatan" TEXT,
    "wilayah_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelompok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jemaat" (
    "id" TEXT NOT NULL,
    "nomor_induk" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "status_keanggotaan" "StatusKeanggotaan" NOT NULL DEFAULT 'TETAP',
    "tanggal_bergabung" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "foto_url" TEXT,
    "catatan_khusus" TEXT,
    "no_hp" TEXT,
    "email" TEXT,
    "alamat" TEXT,
    "kota" TEXT,
    "provinsi" TEXT,
    "status_pernikahan" "StatusPernikahan" NOT NULL DEFAULT 'BELUM_MENIKAH',
    "nama_pasangan" TEXT,
    "jumlah_anak" INTEGER NOT NULL DEFAULT 0,
    "is_kepala_keluarga" BOOLEAN NOT NULL DEFAULT false,
    "no_kk" TEXT,
    "status_baptis" "StatusSakramen" NOT NULL DEFAULT 'BELUM',
    "tanggal_baptis" TIMESTAMP(3),
    "gereja_baptis" TEXT,
    "status_sidi" "StatusSakramen" NOT NULL DEFAULT 'BELUM',
    "tanggal_sidi" TIMESTAMP(3),
    "pendeta_sidi" TEXT,
    "pendidikan" TEXT,
    "pekerjaan" TEXT,
    "instansi" TEXT,
    "minat_pelayanan" TEXT,
    "pelayanan_diikuti" TEXT,
    "peran_dalam_kelompok" TEXT DEFAULT 'Anggota',
    "wilayah_id" TEXT,
    "kelompok_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jemaat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "jemaat_nomor_induk_key" ON "jemaat"("nomor_induk");

-- AddForeignKey
ALTER TABLE "kelompok" ADD CONSTRAINT "kelompok_wilayah_id_fkey" FOREIGN KEY ("wilayah_id") REFERENCES "wilayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jemaat" ADD CONSTRAINT "jemaat_wilayah_id_fkey" FOREIGN KEY ("wilayah_id") REFERENCES "wilayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jemaat" ADD CONSTRAINT "jemaat_kelompok_id_fkey" FOREIGN KEY ("kelompok_id") REFERENCES "kelompok"("id") ON DELETE SET NULL ON UPDATE CASCADE;
