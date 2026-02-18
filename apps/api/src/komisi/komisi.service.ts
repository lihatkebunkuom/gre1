import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKomisiDto } from './dto/create-komisi.dto';

@Injectable()
export class KomisiService {
  constructor(private prisma: PrismaService) {}

  async create(createKomisiDto: CreateKomisiDto) {
    return this.prisma.komisi.create({
      data: createKomisiDto,
    });
  }

  async findAll(search?: string) {
    return this.prisma.komisi.findMany({
      where: search
        ? {
            OR: [
              { namaKomisi: { contains: search, mode: 'insensitive' } },
              { keterangan: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const komisi = await this.prisma.komisi.findUnique({
      where: { id },
    });
    if (!komisi) {
      throw new NotFoundException(`Komisi with ID ${id} not found`);
    }
    return komisi;
  }

  async update(id: string, updateKomisiDto: Partial<CreateKomisiDto>) {
    await this.findOne(id);
    return this.prisma.komisi.update({
      where: { id },
      data: updateKomisiDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.komisi.delete({
      where: { id },
    });
  }
}
