import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahKhususDto } from './dto/create-ibadah-khusus.dto';
import { UpdateIbadahKhususDto } from './dto/update-ibadah-khusus.dto';

@Injectable()
export class IbadahKhususService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateIbadahKhususDto) {
    const { tanggalkhusus, ...rest } = createDto;
    return this.prisma.ibadahKhusus.create({
      data: {
        ...rest,
        tanggalkhusus: tanggalkhusus ? new Date(tanggalkhusus) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.ibadahKhusus.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ibadah = await this.prisma.ibadahKhusus.findUnique({
      where: { id },
    });
    if (!ibadah) {
      throw new NotFoundException(`Ibadah Khusus with ID ${id} not found`);
    }
    return ibadah;
  }

  async update(id: string, updateDto: UpdateIbadahKhususDto) {
    await this.findOne(id);
    const { tanggalkhusus, ...rest } = updateDto;
    
    return this.prisma.ibadahKhusus.update({
      where: { id },
      data: {
        ...rest,
        tanggalkhusus: tanggalkhusus ? new Date(tanggalkhusus) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ibadahKhusus.delete({
      where: { id },
    });
  }
}
