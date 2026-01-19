-- CreateTable
CREATE TABLE "artikel_renungan" (
    "id" TEXT NOT NULL,
    "jenis_konten" TEXT NOT NULL,
    "judul_konten" TEXT NOT NULL,
    "sub_judul" TEXT,
    "penulis" TEXT NOT NULL,
    "tanggal_terbit" TIMESTAMP(3) NOT NULL,
    "kategori_konten" TEXT NOT NULL,
    "ayat_alkitab" TEXT,
    "isi_konten" TEXT NOT NULL,
    "ringkasan_konten" TEXT NOT NULL,
    "gambar_sampul" TEXT,
    "status_publikasi" TEXT NOT NULL DEFAULT 'DRAFT',
    "tag" TEXT,
    "jumlah_dibaca" INTEGER NOT NULL DEFAULT 0,
    "catatan_editor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artikel_renungan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "berita_komsel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "berita_komsel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buletin" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "file_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buletin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_galeri" (
    "id" TEXT NOT NULL,
    "jenis_media" TEXT NOT NULL,
    "judul_media" TEXT NOT NULL,
    "deskripsi_media" TEXT,
    "kategori_media" TEXT NOT NULL,
    "file_media" TEXT NOT NULL,
    "thumbnail_media" TEXT,
    "tanggal_upload" TIMESTAMP(3) NOT NULL,
    "durasi_media" TEXT,
    "pengunggah" TEXT NOT NULL,
    "status_tampil" TEXT NOT NULL DEFAULT 'DITAMPILKAN',
    "tag_media" TEXT,
    "catatan_media" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_galeri_pkey" PRIMARY KEY ("id")
);
