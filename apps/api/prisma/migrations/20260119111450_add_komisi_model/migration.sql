-- CreateTable
CREATE TABLE "komisi" (
    "id" TEXT NOT NULL,
    "nama_komisi" TEXT NOT NULL,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "komisi_pkey" PRIMARY KEY ("id")
);
