import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePelayananDto } from './dto/create-pelayanan.dto';
import { UpdatePelayananDto } from './dto/update-pelayanan.dto';

@Injectable()
export class PelayananService {
  constructor(private prisma: PrismaService) {}

  async create(createPelayananDto: CreatePelayananDto) {
    return this.prisma.pelayanan.create({
      data: {
        namaPelayanan: createPelayananDto.nama_pelayanan,
        kategoriPelayanan: createPelayananDto.kategori_pelayanan,
        deskripsiPelayanan: createPelayananDto.deskripsi_pelayanan,
        koordinatorPelayanan: createPelayananDto.koordinator_pelayanan,
        jumlahKebutuhanPersonel: createPelayananDto.jumlah_kebutuhan_personel,
        statusPelayanan: createPelayananDto.status_pelayanan || 'AKTIF',
        jadwalPelayanan: createPelayananDto.jadwal_pelayanan,
        catatanPelayanan: createPelayananDto.catatan_pelayanan,
      },
    });
  }

  async findAll(search?: string) {
    let items;
    if (search) {
      items = await this.prisma.pelayanan.findMany({
        where: {
          OR: [
            { namaPelayanan: { contains: search, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      items = await this.prisma.pelayanan.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }
    return items.map(item => this.mapToDto(item));
  }

  async findOne(id: string) {
    const item = await this.prisma.pelayanan.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Data pelayanan tidak ditemukan');
    
    // Map backend camelCase to frontend snake_case
    return this.mapToDto(item);
  }

  async update(id: string, updatePelayananDto: UpdatePelayananDto) {
    await this.findOne(id);
    const updated = await this.prisma.pelayanan.update({
      where: { id },
      data: {
        namaPelayanan: updatePelayananDto.nama_pelayanan,
        kategoriPelayanan: updatePelayananDto.kategori_pelayanan,
        deskripsiPelayanan: updatePelayananDto.deskripsi_pelayanan,
        koordinatorPelayanan: updatePelayananDto.koordinator_pelayanan,
        jumlahKebutuhanPersonel: updatePelayananDto.jumlah_kebutuhan_personel,
        statusPelayanan: updatePelayananDto.status_pelayanan,
        jadwalPelayanan: updatePelayananDto.jadwal_pelayanan,
        catatanPelayanan: updatePelayananDto.catatan_pelayanan,
      },
    });
    return this.mapToDto(updated);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pelayanan.delete({
      where: { id },
    });
  }

  private mapToDto(item: any) {
    return {
      id: item.id,
      nama_pelayanan: item.namaPelayanan,
      kategori_pelayanan: item.kategoriPelayanan,
      deskripsi_pelayanan: item.deskripsiPelayanan,
      koordinator_pelayanan: item.koordinatorPelayanan,
      jumlah_kebutuhan_personel: item.jumlahKebutuhanPersonel,
      status_pelayanan: item.statusPelayanan,
      jadwal_pelayanan: item.jadwalPelayanan,
      catatan_pelayanan: item.catatanPelayanan,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}