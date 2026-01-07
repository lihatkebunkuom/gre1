"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JemaatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JemaatService = class JemaatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createJemaatDto) {
        if (!createJemaatDto.nomorInduk) {
            const now = new Date();
            const dateStr = now.getFullYear().toString().slice(-2);
            const timeStr = now.getTime().toString().slice(-4);
            createJemaatDto.nomorInduk = `GM-${dateStr}${timeStr}`;
        }
        return this.prisma.jemaat.create({
            data: createJemaatDto,
        });
    }
    async createJemaatWithRelations(data) {
        let wilayahId = data.wilayahId;
        let kelompokId = data.kelompokId;
        if (data.wilayah) {
            if (data.wilayah.id) {
                wilayahId = data.wilayah.id;
            }
            else {
                const newWilayah = await this.prisma.wilayah.create({ data: data.wilayah });
                wilayahId = newWilayah.id;
            }
        }
        if (data.kelompok) {
            if (data.kelompok.id) {
                kelompokId = data.kelompok.id;
            }
            else {
                const { wilayahId: kelompokWilayahId, ...kelompokData } = data.kelompok;
                const newKelompok = await this.prisma.kelompok.create({
                    data: {
                        ...kelompokData,
                        wilayah: wilayahId ? { connect: { id: wilayahId } } : undefined,
                    },
                });
                kelompokId = newKelompok.id;
            }
        }
        const { wilayah, kelompok, ...jemaatData } = data;
        if (!jemaatData.nomorInduk) {
            const now = new Date();
            const dateStr = now.getFullYear().toString().slice(-2);
            const timeStr = now.getTime().toString().slice(-4);
            jemaatData.nomorInduk = `GM-${dateStr}${timeStr}`;
        }
        return this.prisma.jemaat.create({
            data: {
                ...jemaatData,
                wilayah: wilayahId ? { connect: { id: wilayahId } } : undefined,
                kelompok: kelompokId ? { connect: { id: kelompokId } } : undefined,
            },
            include: { wilayah: true, kelompok: true },
        });
    }
    findAll(search) {
        if (search) {
            return this.prisma.jemaat.findMany({
                where: {
                    OR: [
                        { nama: { contains: search, mode: 'insensitive' } },
                        { nomorInduk: { contains: search, mode: 'insensitive' } },
                    ],
                },
                include: { wilayah: true, kelompok: true },
                orderBy: { nama: 'asc' },
            });
        }
        return this.prisma.jemaat.findMany({
            include: { wilayah: true, kelompok: true },
            orderBy: { nama: 'asc' },
        });
    }
    findOne(id) {
        return this.prisma.jemaat.findUnique({
            where: { id },
            include: { wilayah: true, kelompok: true },
        });
    }
    update(id, updateJemaatDto) {
        return this.prisma.jemaat.update({
            where: { id },
            data: updateJemaatDto,
        });
    }
    remove(id) {
        return this.prisma.jemaat.delete({
            where: { id },
        });
    }
};
exports.JemaatService = JemaatService;
exports.JemaatService = JemaatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JemaatService);
//# sourceMappingURL=jemaat.service.js.map