import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePendetaDto } from './dto/create-pendeta.dto';
import { UpdatePendetaDto } from './dto/update-pendeta.dto';

@Injectable()
export class PendetaService {
  constructor(private prisma: PrismaService) {}

  create(createPendetaDto: CreatePendetaDto) {
    return this.prisma.pendeta.create({
      data: createPendetaDto,
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
    return this.prisma.pendeta.update({
      where: { id },
      data: updatePendetaDto,
    });
  }

  remove(id: string) {
    return this.prisma.pendeta.delete({
      where: { id },
    });
  }
}
