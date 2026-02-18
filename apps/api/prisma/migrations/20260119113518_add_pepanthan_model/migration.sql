-- CreateTable
CREATE TABLE "pepanthan" (
    "id" TEXT NOT NULL,
    "nama_pepanthan" TEXT NOT NULL,
    "alamat" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pepanthan_pkey" PRIMARY KEY ("id")
);
