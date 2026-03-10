import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePendetaDto } from './dto/create-pendeta.dto';
import { UpdatePendetaDto } from './dto/update-pendeta.dto';

@Injectable()
export class PendetaService {
  constructor(private prisma: PrismaService) {}

  create(createPendetaDto: CreatePendetaDto) {
    const data = { ...createPendetaDto };
    
    // Pastikan tanggal hanya diproses jika ada nilainya
    if (data.tanggalLahir === null || data.tanggalLahir === undefined) {
      delete data.tanggalLahir;
    }
    if (data.tanggalPenahbisan === null || data.tanggalPenahbisan === undefined) {
      delete data.tanggalPenahbisan;
    }
    
    // Status pernikahan dibiarkan sesuai kiriman DTO (bisa null)
    return this.prisma.pendeta.create({
      data,
    });
  }

  findAll() {
    return this.prisma.pendeta.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.pendeta.findUnique({
      where: { id },
    });
  }

  update(id: string, updatePendetaDto: UpdatePendetaDto) {
    const data = { ...updatePendetaDto };
    
    if (data.tanggalLahir === null || data.tanggalLahir === undefined) {
      delete data.tanggalLahir;
    }
    if (data.tanggalPenahbisan === null || data.tanggalPenahbisan === undefined) {
      delete data.tanggalPenahbisan;
    }

    return this.prisma.pendeta.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.pendeta.delete({
      where: { id },
    });
  }
}
