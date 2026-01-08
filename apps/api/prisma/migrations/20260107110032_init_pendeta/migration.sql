-- CreateEnum
CREATE TYPE "JabatanPendeta" AS ENUM ('GEMBALA_SIDANG', 'WAKIL_GEMBALA', 'PENDETA_MUDA', 'PENATUA', 'EVANGELIS');

-- CreateTable
CREATE TABLE "pendeta" (
    "id" TEXT NOT NULL,
    "nama_lengkap" TEXT NOT NULL,
    "gelar" TEXT,
    "jenis_kelamin" "JenisKelamin" NOT NULL,
    "tempat_lahir" TEXT,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "foto_pendeta" TEXT,
    "no_handphone" TEXT NOT NULL,
    "email" TEXT,
    "alamat" TEXT,
    "kota" TEXT,
    "provinsi" TEXT,
    "jabatan_pelayanan" "JabatanPendeta" NOT NULL,
    "tanggal_penahbisan" TIMESTAMP(3),
    "wilayah_pelayanan" TEXT,
    "bidang_pelayanan" TEXT,
    "jadwal_pelayanan" TEXT,
    "nomor_induk_pendeta" TEXT,
    "status_pernikahan" "StatusPernikahan" NOT NULL DEFAULT 'BELUM_MENIKAH',
    "nama_pasangan" TEXT,
    "jumlah_anak" INTEGER NOT NULL DEFAULT 0,
    "pendidikan_terakhir" TEXT,
    "institusi_teologi" TEXT,
    "tahun_lulus" INTEGER,
    "riwayat_pendidikan" TEXT,
    "biografi_singkat" TEXT,
    "ig_link" TEXT,
    "fb_link" TEXT,
    "yt_link" TEXT,
    "catatan_internal" TEXT,
    "riwayat_pelayanan_text" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pendeta_pkey" PRIMARY KEY ("id")
);
