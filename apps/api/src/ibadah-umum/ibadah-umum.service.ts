import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahUmumDto } from './dto/create-ibadah-umum.dto';

@Injectable()
export class IbadahUmumService {
  constructor(private prisma: PrismaService) {}

  async create(createIbadahUmumDto: CreateIbadahUmumDto) {
    const { tanggalumum, ...rest } = createIbadahUmumDto;
    return this.prisma.ibadahUmum.create({
      data: {
        ...rest,
        tanggalumum: tanggalumum ? new Date(tanggalumum) : null,
      },
    });
  }

  async findAll(search?: string) {
    return this.prisma.ibadahUmum.findMany({
      where: search
        ? {
            OR: [
              { judul: { contains: search, mode: 'insensitive' } },
              { keterangan: { contains: search, mode: 'insensitive' } },
              { lokasi: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ibadah = await this.prisma.ibadahUmum.findUnique({
      where: { id },
    });
    if (!ibadah) {
      throw new NotFoundException(`Ibadah Umum with ID ${id} not found`);
    }
    return ibadah;
  }

  async update(id: string, updateIbadahUmumDto: Partial<CreateIbadahUmumDto>) {
    await this.findOne(id);
    const { tanggalumum, ...rest } = updateIbadahUmumDto;
    
    return this.prisma.ibadahUmum.update({
      where: { id },
      data: {
        ...rest,
        tanggalumum: tanggalumum ? new Date(tanggalumum) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ibadahUmum.delete({
      where: { id },
    });
  }
}
