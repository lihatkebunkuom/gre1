// Domain khusus fitur 'Jemaat'
// Ini menjaga agar types tidak tercampur aduk di global

export interface Jemaat {
  id: string;
  nomorAnggota: string;
  namaLengkap: string;
  jenisKelamin: 'L' | 'P';
  tanggalLahir: string;
  alamat: string;
  statusBaptis: boolean;
  tanggalBaptis?: string;
  statusPernikahan: 'BELUM_MENIKAH' | 'MENIKAH' | 'JANDA' | 'DUDA';
  noTelepon: string;
}

export interface JemaatFilter {
  search?: string;
  statusBaptis?: boolean;
  wilayah?: string;
}