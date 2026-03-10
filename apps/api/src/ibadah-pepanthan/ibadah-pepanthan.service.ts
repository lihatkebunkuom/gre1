import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahPepanthanDto } from './dto/create-ibadah-pepanthan.dto';
import { UpdateIbadahPepanthanDto } from './dto/update-ibadah-pepanthan.dto';

@Injectable()
export class IbadahPepanthanService {
  constructor(private prisma: PrismaService) {}

  async create(createIbadahPepanthanDto: CreateIbadahPepanthanDto) {
    const { tanggalpepanthan, ...rest } = createIbadahPepanthanDto;
    return this.prisma.ibadahPepanthan.create({
      data: {
        ...rest,
        tanggalpepanthan: tanggalpepanthan ? new Date(tanggalpepanthan) : null,
      },
    });
  }

  async findAll(search?: string) {
    return this.prisma.ibadahPepanthan.findMany({
      where: search
        ? {
            OR: [
              { judul: { contains: search, mode: 'insensitive' } },
              { keterangan: { contains: search, mode: 'insensitive' } },
              { lokasi: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      include: {
        pepanthan: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const ibadah = await this.prisma.ibadahPepanthan.findUnique({
      where: { id },
      include: {
        pepanthan: true,
      },
    });
    if (!ibadah) {
      throw new NotFoundException(`Ibadah Pepanthan with ID ${id} not found`);
    }
    return ibadah;
  }

  async update(id: string, updateIbadahPepanthanDto: UpdateIbadahPepanthanDto) {
    await this.findOne(id);
    const { tanggalpepanthan, ...rest } = updateIbadahPepanthanDto;
    
    return this.prisma.ibadahPepanthan.update({
      where: { id },
      data: {
        ...rest,
        tanggalpepanthan: tanggalpepanthan ? new Date(tanggalpepanthan) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ibadahPepanthan.delete({
      where: { id },
    });
  }
}
