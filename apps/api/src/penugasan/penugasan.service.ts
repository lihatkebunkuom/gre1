import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenugasanDto } from './dto/create-penugasan.dto';
import { UpdatePenugasanDto } from './dto/update-penugasan.dto';

@Injectable()
export class PenugasanService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePenugasanDto) {
    const created = await this.prisma.penugasan.create({
      data: {
        pelayananId: createDto.pelayanan_id,
        petugasId: createDto.petugas_id,
        peranDalamPelayanan: createDto.peran_dalam_pelayanan,
        tanggalMulaiPenugasan: new Date(createDto.tanggal_mulai_penugasan),
        tanggalSelesaiPenugasan: createDto.tanggal_selesai_penugasan ? new Date(createDto.tanggal_selesai_penugasan) : null,
        jadwalTugas: createDto.jadwal_tugas,
        statusPenugasan: createDto.status_penugasan || 'AKTIF',
        evaluasiKinerja: createDto.evaluasi_kinerja,
        catatanPenugasan: createDto.catatan_penugasan,
      },
      include: {
        pelayanan: true,
        petugas: true,
      }
    });
    return this.mapToDto(created);
  }

  async findAll() {
    const items = await this.prisma.penugasan.findMany({
      include: {
        pelayanan: true,
        petugas: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return items.map(item => this.mapToDto(item));
  }

  async findOne(id: string) {
    const item = await this.prisma.penugasan.findUnique({
      where: { id },
      include: {
        pelayanan: true,
        petugas: true,
      },
    });
    if (!item) throw new NotFoundException('Data penugasan tidak ditemukan');
    return this.mapToDto(item);
  }

  async update(id: string, updateDto: UpdatePenugasanDto) {
    await this.findOne(id); // Check existence
    
    const data: any = {};
    if (updateDto.pelayanan_id) data.pelayananId = updateDto.pelayanan_id;
    if (updateDto.petugas_id) data.petugasId = updateDto.petugas_id;
    if (updateDto.peran_dalam_pelayanan) data.peranDalamPelayanan = updateDto.peran_dalam_pelayanan;
    if (updateDto.tanggal_mulai_penugasan) data.tanggalMulaiPenugasan = new Date(updateDto.tanggal_mulai_penugasan);
    if (updateDto.tanggal_selesai_penugasan !== undefined) data.tanggalSelesaiPenugasan = updateDto.tanggal_selesai_penugasan ? new Date(updateDto.tanggal_selesai_penugasan) : null;
    if (updateDto.jadwal_tugas !== undefined) data.jadwalTugas = updateDto.jadwal_tugas;
    if (updateDto.status_penugasan) data.statusPenugasan = updateDto.status_penugasan;
    if (updateDto.evaluasi_kinerja !== undefined) data.evaluasiKinerja = updateDto.evaluasi_kinerja;
    if (updateDto.catatan_penugasan !== undefined) data.catatanPenugasan = updateDto.catatan_penugasan;

    const updated = await this.prisma.penugasan.update({
      where: { id },
      data,
      include: {
        pelayanan: true,
        petugas: true,
      },
    });
    return this.mapToDto(updated);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.penugasan.delete({
      where: { id },
    });
  }

  private mapToDto(item: any) {
    return {
      id: item.id,
      pelayanan_id: item.pelayananId,
      nama_pelayanan: item.pelayanan?.namaPelayanan,
      petugas_id: item.petugasId,
      nama_petugas: item.petugas?.nama,
      peran_dalam_pelayanan: item.peranDalamPelayanan,
      tanggal_mulai_penugasan: item.tanggalMulaiPenugasan,
      tanggal_selesai_penugasan: item.tanggalSelesaiPenugasan,
      jadwal_tugas: item.jadwalTugas,
      status_penugasan: item.statusPenugasan,
      evaluasi_kinerja: item.evaluasiKinerja,
      catatan_penugasan: item.catatanPenugasan,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
    };
  }
}
