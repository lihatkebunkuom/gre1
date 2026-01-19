-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('BANNER', 'ARTIKEL');

-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "type" "BannerType" NOT NULL DEFAULT 'BANNER';
