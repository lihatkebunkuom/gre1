-- CreateTable
CREATE TABLE "renungan" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "penulis" TEXT NOT NULL,
    "ayat_alkitab" TEXT,
    "ringkasan" TEXT,
    "kategori" TEXT,
    "gambar_url" TEXT,
    "tts_status" BOOLEAN NOT NULL DEFAULT true,
    "tts_bahasa" TEXT NOT NULL DEFAULT 'id-ID',
    "tts_kecepatan_baca" TEXT NOT NULL DEFAULT '1',
    "status_tampil" TEXT NOT NULL DEFAULT 'AKTIF',
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "renungan_pkey" PRIMARY KEY ("id")
);
