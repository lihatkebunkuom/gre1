-- CreateTable
CREATE TABLE "ibadah_pepanthan" (
    "id" TEXT NOT NULL,
    "judul" TEXT,
    "waktu_mulai" TEXT,
    "keterangan" TEXT,
    "lokasi" TEXT,
    "pepanthan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ibadah_pepanthan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ibadah_pepanthan" ADD CONSTRAINT "ibadah_pepanthan_pepanthan_id_fkey" FOREIGN KEY ("pepanthan_id") REFERENCES "pepanthan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
