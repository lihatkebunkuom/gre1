-- CreateTable
CREATE TABLE "kalender_event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kalender_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jadwal_ibadah" (
    "id" TEXT NOT NULL,
    "nama_ibadah" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktu_mulai" TIMESTAMP(3) NOT NULL,
    "waktu_selesai" TIMESTAMP(3) NOT NULL,
    "lokasi" TEXT NOT NULL,
    "pembicara" TEXT NOT NULL,
    "tema" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jadwal_ibadah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kebaktian_minggu" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktu" TIMESTAMP(3) NOT NULL,
    "tema" TEXT NOT NULL,
    "pengkhotbah" TEXT NOT NULL,
    "liturgos" TEXT NOT NULL,
    "pembaca_warta" TEXT,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kebaktian_minggu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi_kehadiran" (
    "id" TEXT NOT NULL,
    "jadwal_ibadah_id" TEXT NOT NULL,
    "jemaat_id" TEXT NOT NULL,
    "waktu_hadir" TIMESTAMP(3) NOT NULL,
    "metode" "MetodeKehadiran" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensi_kehadiran_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "absensi_kehadiran" ADD CONSTRAINT "absensi_kehadiran_jadwal_ibadah_id_fkey" FOREIGN KEY ("jadwal_ibadah_id") REFERENCES "jadwal_ibadah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi_kehadiran" ADD CONSTRAINT "absensi_kehadiran_jemaat_id_fkey" FOREIGN KEY ("jemaat_id") REFERENCES "jemaat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
