import { ApiProperty } from '@nestjs/swagger';

export class Penugasan {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pelayanan_id: string;

  @ApiProperty()
  petugas_id: string;

  @ApiProperty()
  peran_dalam_pelayanan: string;

  @ApiProperty()
  tanggal_mulai_penugasan: Date;

  @ApiProperty({ required: false, nullable: true })
  tanggal_selesai_penugasan: Date | null;

  @ApiProperty({ required: false, nullable: true })
  jadwal_tugas: string | null;

  @ApiProperty()
  status_penugasan: string;

  @ApiProperty({ required: false, nullable: true })
  evaluasi_kinerja: string | null;

  @ApiProperty({ required: false, nullable: true })
  catatan_penugasan: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
  
  // Relations (optional in response, depending on service implementation)
  @ApiProperty({ required: false })
  nama_pelayanan?: string;
  
  @ApiProperty({ required: false })
  nama_petugas?: string;
}
