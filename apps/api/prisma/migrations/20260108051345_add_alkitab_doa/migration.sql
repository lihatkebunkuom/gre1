-- CreateTable
CREATE TABLE "ayat_alkitab" (
    "id" TEXT NOT NULL,
    "versi_alkitab" TEXT NOT NULL,
    "kitab" TEXT NOT NULL,
    "pasal" INTEGER NOT NULL,
    "ayat" INTEGER NOT NULL,
    "teks_ayat" TEXT NOT NULL,
    "bahasa" TEXT NOT NULL DEFAULT 'id-ID',
    "kategori_ayat" TEXT,
    "kata_kunci" TEXT,
    "tts_status" BOOLEAN NOT NULL DEFAULT true,
    "tts_bahasa" TEXT NOT NULL DEFAULT 'id-ID',
    "tts_kecepatan_baca" TEXT NOT NULL DEFAULT '1',
    "status_tampil" TEXT NOT NULL DEFAULT 'AKTIF',
    "catatan_ayat" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ayat_alkitab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pokok_doa" (
    "id" TEXT NOT NULL,
    "judul_pokok_doa" TEXT NOT NULL,
    "kategori_doa" TEXT NOT NULL,
    "deskripsi_doa" TEXT NOT NULL,
    "pengaju_doa" TEXT NOT NULL,
    "tanggal_pengajuan" TIMESTAMP(3) NOT NULL,
    "tingkat_prioritas" TEXT NOT NULL DEFAULT 'Sedang',
    "status_doa" TEXT NOT NULL DEFAULT 'AKTIF',
    "tanggal_terjawab" TIMESTAMP(3),
    "kesaksian_jawaban_doa" TEXT,
    "tts_status" BOOLEAN NOT NULL DEFAULT true,
    "tts_bahasa" TEXT NOT NULL DEFAULT 'id-ID',
    "tts_kecepatan_baca" TEXT NOT NULL DEFAULT '1',
    "status_tampil" TEXT NOT NULL DEFAULT 'PUBLIK',
    "catatan_doa" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokok_doa_pkey" PRIMARY KEY ("id")
);
