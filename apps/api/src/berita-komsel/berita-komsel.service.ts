import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBeritaKomselDto } from './dto/create-berita-komsel.dto';
import { UpdateBeritaKomselDto } from './dto/update-berita-komsel.dto';

@Injectable()
export class BeritaKomselService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateBeritaKomselDto) {
    return this.prisma.beritaKomsel.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.beritaKomsel.findMany({
      orderBy: { tanggal: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.beritaKomsel.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`Berita Komsel with ID ${id} not found`);
    }
    return item;
  }

  async update(id: string, updateDto: UpdateBeritaKomselDto) {
    await this.findOne(id);
    return this.prisma.beritaKomsel.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.beritaKomsel.delete({
      where: { id },
    });
  }
}
