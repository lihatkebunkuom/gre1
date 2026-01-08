import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKebaktianMingguDto } from './dto/create-kebaktian-minggu.dto';
import { UpdateKebaktianMingguDto } from './dto/update-kebaktian-minggu.dto';

@Injectable()
export class KebaktianMingguService {
  constructor(private prisma: PrismaService) {}

  create(createKebaktianMingguDto: CreateKebaktianMingguDto) {
    return this.prisma.kebaktianMinggu.create({
      data: createKebaktianMingguDto,
    });
  }

  findAll() {
    return this.prisma.kebaktianMinggu.findMany();
  }

  findOne(id: string) {
    return this.prisma.kebaktianMinggu.findUnique({
      where: { id },
    });
  }

  update(id: string, updateKebaktianMingguDto: UpdateKebaktianMingguDto) {
    return this.prisma.kebaktianMinggu.update({
      where: { id },
      data: updateKebaktianMingguDto,
    });
  }

  remove(id: string) {
    return this.prisma.kebaktianMinggu.delete({
      where: { id },
    });
  }
}
