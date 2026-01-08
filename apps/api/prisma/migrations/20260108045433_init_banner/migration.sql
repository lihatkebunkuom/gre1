-- CreateEnum
CREATE TYPE "BannerPosition" AS ENUM ('TOP', 'MIDDLE', 'BOTTOM');

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "image_url" TEXT NOT NULL,
    "kategori" TEXT,
    "tanggal" TIMESTAMP(3),
    "position" "BannerPosition" NOT NULL,
    "is_aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);
