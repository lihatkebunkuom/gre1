-- CreateEnum
CREATE TYPE "MetodeKehadiran" AS ENUM ('QR_CODE', 'MANUAL');

-- CreateTable
CREATE TABLE "qr_session" (
    "id" TEXT NOT NULL,
    "kode_qr" TEXT NOT NULL,
    "nama_kegiatan" TEXT NOT NULL,
    "jenis_kegiatan" TEXT NOT NULL,
    "tanggal_kegiatan" DATE NOT NULL,
    "waktu_mulai" TIMESTAMP(3) NOT NULL,
    "waktu_selesai" TIMESTAMP(3) NOT NULL,
    "status_aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kehadiran" (
    "id" TEXT NOT NULL,
    "jemaat_id" TEXT NOT NULL,
    "qr_session_id" TEXT NOT NULL,
    "waktu_hadir" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metode" "MetodeKehadiran" NOT NULL DEFAULT 'QR_CODE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kehadiran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qr_session_kode_qr_key" ON "qr_session"("kode_qr");

-- CreateIndex
CREATE UNIQUE INDEX "kehadiran_jemaat_id_qr_session_id_key" ON "kehadiran"("jemaat_id", "qr_session_id");

-- AddForeignKey
ALTER TABLE "kehadiran" ADD CONSTRAINT "kehadiran_jemaat_id_fkey" FOREIGN KEY ("jemaat_id") REFERENCES "jemaat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kehadiran" ADD CONSTRAINT "kehadiran_qr_session_id_fkey" FOREIGN KEY ("qr_session_id") REFERENCES "qr_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
