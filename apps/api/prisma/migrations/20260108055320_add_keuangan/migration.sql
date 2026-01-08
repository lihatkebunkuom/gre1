-- CreateEnum
CREATE TYPE "JenisTransaksi" AS ENUM ('PEMASUKAN', 'PENGELUARAN');

-- CreateTable
CREATE TABLE "transaksi" (
    "id" TEXT NOT NULL,
    "jenis_transaksi" "JenisTransaksi" NOT NULL,
    "tanggal_transaksi" TIMESTAMP(3) NOT NULL,
    "kategori_transaksi" TEXT NOT NULL,
    "deskripsi_transaksi" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "metode_pembayaran" TEXT NOT NULL,
    "sumber_tujuan" TEXT NOT NULL,
    "penanggung_jawab" TEXT NOT NULL,
    "bukti_transaksi" TEXT,
    "status_transaksi" TEXT NOT NULL DEFAULT 'DRAFT',
    "catatan_transaksi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persembahan" (
    "id" TEXT NOT NULL,
    "jenis_persembahan" TEXT NOT NULL,
    "tanggal_persembahan" TIMESTAMP(3) NOT NULL,
    "ibadah_kegiatan" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "metode_pemberian" TEXT NOT NULL,
    "nama_pemberi" TEXT NOT NULL DEFAULT 'Anonim',
    "kategori_jemaat" TEXT,
    "tujuan_persembahan" TEXT NOT NULL,
    "status_pencatatan" TEXT NOT NULL DEFAULT 'TERCATAT',
    "petugas_pencatat" TEXT NOT NULL,
    "catatan_persembahan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persembahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "laporan_keuangan" (
    "id" TEXT NOT NULL,
    "jenis_laporan" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "tanggal_selesai" TIMESTAMP(3) NOT NULL,
    "total_pemasukan" INTEGER NOT NULL,
    "total_pengeluaran" INTEGER NOT NULL,
    "saldo_awal" INTEGER NOT NULL,
    "saldo_akhir" INTEGER NOT NULL,
    "ringkasan_laporan" TEXT,
    "disusun_oleh" TEXT NOT NULL,
    "status_laporan" TEXT NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "laporan_keuangan_pkey" PRIMARY KEY ("id")
);
