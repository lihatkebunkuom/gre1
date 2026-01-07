declare enum JenisKelamin {
    L = "L",
    P = "P"
}
declare enum StatusKeanggotaan {
    TETAP = "TETAP",
    TITIPAN = "TITIPAN",
    TAMU = "TAMU"
}
declare enum StatusPernikahan {
    BELUM_MENIKAH = "BELUM_MENIKAH",
    MENIKAH = "MENIKAH",
    CERAI_HIDUP = "CERAI_HIDUP",
    CERAI_MATI = "CERAI_MATI"
}
declare enum StatusSakramen {
    SUDAH = "SUDAH",
    BELUM = "BELUM"
}
export declare class CreateJemaatDto {
    nomorInduk?: string;
    nama: string;
    jenisKelamin: JenisKelamin;
    tempatLahir?: string;
    tanggalLahir: string;
    statusAktif?: boolean;
    statusKeanggotaan?: StatusKeanggotaan;
    tanggalBergabung?: string;
    fotoUrl?: string;
    catatanKhusus?: string;
    noHp?: string;
    email?: string;
    alamat?: string;
    kota?: string;
    provinsi?: string;
    statusPernikahan?: StatusPernikahan;
    namaPasangan?: string;
    jumlahAnak?: number;
    isKepalaKeluarga?: boolean;
    noKK?: string;
    statusBaptis?: StatusSakramen;
    tanggalBaptis?: string;
    gerejaBaptis?: string;
    statusSidi?: StatusSakramen;
    tanggalSidi?: string;
    pendetaSidi?: string;
    pendidikan?: string;
    pekerjaan?: string;
    instansi?: string;
    minatPelayanan?: string;
    pelayananDiikuti?: string;
    peranDalamKelompok?: string;
    wilayahId?: string;
    kelompokId?: string;
}
export {};
