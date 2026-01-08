import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePokokDoaDto } from './dto/create-pokok-doa.dto';
import { UpdatePokokDoaDto } from './dto/update-pokok-doa.dto';

@Injectable()
export class DoaService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePokokDoaDto) {
    return this.prisma.pokokDoa.create({
      data: {
        ...createDto,
        tanggalPengajuan: new Date(createDto.tanggalPengajuan),
        tanggalTerjawab: createDto.tanggalTerjawab ? new Date(createDto.tanggalTerjawab) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.pokokDoa.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const doa = await this.prisma.pokokDoa.findUnique({
      where: { id },
    });

    if (!doa) {
      throw new NotFoundException(`Pokok Doa with ID ${id} not found`);
    }

    return doa;
  }

  async update(id: string, updateDto: UpdatePokokDoaDto) {
    const data: any = { ...updateDto };
    if (updateDto.tanggalPengajuan) {
      data.tanggalPengajuan = new Date(updateDto.tanggalPengajuan);
    }
    if (updateDto.tanggalTerjawab) {
      data.tanggalTerjawab = new Date(updateDto.tanggalTerjawab);
    }

    return this.prisma.pokokDoa.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.pokokDoa.delete({
      where: { id },
    });
  }
}
