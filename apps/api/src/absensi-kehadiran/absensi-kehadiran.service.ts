import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAbsensiKehadiranDto } from './dto/create-absensi-kehadiran.dto';
import { UpdateAbsensiKehadiranDto } from './dto/update-absensi-kehadiran.dto';

@Injectable()
export class AbsensiKehadiranService {
  constructor(private prisma: PrismaService) {}

  create(createAbsensiKehadiranDto: CreateAbsensiKehadiranDto) {
    return this.prisma.absensiKehadiran.create({
      data: createAbsensiKehadiranDto,
    });
  }

  findAll() {
    return this.prisma.absensiKehadiran.findMany();
  }

  findOne(id: string) {
    return this.prisma.absensiKehadiran.findUnique({
      where: { id },
    });
  }

  update(id: string, updateAbsensiKehadiranDto: UpdateAbsensiKehadiranDto) {
    return this.prisma.absensiKehadiran.update({
      where: { id },
      data: updateAbsensiKehadiranDto,
    });
  }

  remove(id: string) {
    return this.prisma.absensiKehadiran.delete({
      where: { id },
    });
  }
}
