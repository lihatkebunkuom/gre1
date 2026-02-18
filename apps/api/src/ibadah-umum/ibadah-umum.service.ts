import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahUmumDto } from './dto/create-ibadah-umum.dto';

@Injectable()
export class IbadahUmumService {
  constructor(private prisma: PrismaService) {}

  async create(createIbadahUmumDto: CreateIbadahUmumDto) {
    return this.prisma.ibadahUmum.create({
      data: createIbadahUmumDto,
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
    return this.prisma.ibadahUmum.update({
      where: { id },
      data: updateIbadahUmumDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ibadahUmum.delete({
      where: { id },
    });
  }
}