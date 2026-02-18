-- CreateTable
CREATE TABLE "ibadah_umum" (
    "id" TEXT NOT NULL,
    "judul" TEXT,
    "waktu_mulai" TIMESTAMP(3),
    "keterangan" TEXT,
    "lokasi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ibadah_umum_pkey" PRIMARY KEY ("id")
);
