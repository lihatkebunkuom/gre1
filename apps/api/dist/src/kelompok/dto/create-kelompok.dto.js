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
exports.CreateKelompokDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateKelompokDto {
    id;
    nama;
    ketua;
    jadwal;
    catatan;
    wilayahId;
}
exports.CreateKelompokDto = CreateKelompokDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-kelompok-v4', description: 'ID Kelompok (Optional, untuk menghubungkan ke Kelompok yang sudah ada)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Komsel Efrata 1', description: 'Nama kelompok sel' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "nama", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Bpk. Yohanes', description: 'Nama ketua/gembala kelompok' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "ketua", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jumat, 19:00 WIB', description: 'Jadwal pertemuan rutin' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "jadwal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Fokus pemuridan muda mudi', description: 'Catatan tambahan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "catatan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-wilayah-v4', description: 'ID Wilayah (Optional)' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateKelompokDto.prototype, "wilayahId", void 0);
//# sourceMappingURL=create-kelompok.dto.js.map