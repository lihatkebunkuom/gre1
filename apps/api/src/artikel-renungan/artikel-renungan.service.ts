import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtikelRenunganDto } from './dto/create-artikel-renungan.dto';
import { UpdateArtikelRenunganDto } from './dto/update-artikel-renungan.dto';

@Injectable()
export class ArtikelRenunganService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateArtikelRenunganDto) {
    return this.prisma.artikelRenungan.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.artikelRenungan.findMany({
      orderBy: { tanggalTerbit: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.artikelRenungan.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Artikel/Renungan with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: UpdateArtikelRenunganDto) {
    await this.findOne(id);
    return this.prisma.artikelRenungan.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.artikelRenungan.delete({
      where: { id },
    });
  }
}
