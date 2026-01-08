-- CreateTable
CREATE TABLE "produk" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "deskripsi" TEXT NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produk_pkey" PRIMARY KEY ("id")
);
