import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIbadahKhususDto } from './dto/create-ibadah-khusus.dto';
import { UpdateIbadahKhususDto } from './dto/update-ibadah-khusus.dto';

@Injectable()
export class IbadahKhususService {
  constructor(private prisma: PrismaService) {}

  create(createDto: CreateIbadahKhususDto) {
    return this.prisma.ibadahKhusus.create({
      data: createDto,
    });
  }

  findAll() {
    return this.prisma.ibadahKhusus.findMany({
      orderBy: { waktu: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.ibadahKhusus.findUnique({
      where: { id },
    });
  }

  update(id: string, updateDto: UpdateIbadahKhususDto) {
    return this.prisma.ibadahKhusus.update({
      where: { id },
      data: updateDto,
    });
  }

  remove(id: string) {
    return this.prisma.ibadahKhusus.delete({
      where: { id },
    });
  }
}
