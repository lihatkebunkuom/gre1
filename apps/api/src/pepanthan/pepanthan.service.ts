import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePepanthanDto } from './dto/create-pepanthan.dto';

@Injectable()
export class PepanthanService {
  constructor(private prisma: PrismaService) {}

  async create(createPepanthanDto: CreatePepanthanDto) {
    return this.prisma.pepanthan.create({
      data: createPepanthanDto,
    });
  }

  async findAll(search?: string) {
    return this.prisma.pepanthan.findMany({
      where: search
        ? {
            OR: [
              { namaPepanthan: { contains: search, mode: 'insensitive' } },
              { alamat: { contains: search, mode: 'insensitive' } },
              { keterangan: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pepanthan = await this.prisma.pepanthan.findUnique({
      where: { id },
    });
    if (!pepanthan) {
      throw new NotFoundException(`Pepanthan with ID ${id} not found`);
    }
    return pepanthan;
  }

  async update(id: string, updatePepanthanDto: Partial<CreatePepanthanDto>) {
    await this.findOne(id);
    return this.prisma.pepanthan.update({
      where: { id },
      data: updatePepanthanDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pepanthan.delete({
      where: { id },
    });
  }
}
