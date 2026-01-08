-- CreateTable
CREATE TABLE "pelayanan" (
    "id" TEXT NOT NULL,
    "kode_pelayanan" TEXT NOT NULL,
    "nama_pelayanan" TEXT NOT NULL,
    "kategori_pelayanan" TEXT NOT NULL,
    "deskripsi_pelayanan" TEXT,
    "koordinator_pelayanan" TEXT NOT NULL,
    "jumlah_kebutuhan_personel" INTEGER NOT NULL DEFAULT 0,
    "status_pelayanan" TEXT NOT NULL DEFAULT 'AKTIF',
    "jadwal_pelayanan" TEXT,
    "catatan_pelayanan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pelayanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pelayanan_kode_pelayanan_key" ON "pelayanan"("kode_pelayanan");
