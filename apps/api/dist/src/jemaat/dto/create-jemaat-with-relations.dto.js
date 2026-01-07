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
exports.CreateJemaatWithRelationsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_kelompok_dto_1 = require("../../kelompok/dto/create-kelompok.dto");
const create_wilayah_dto_1 = require("../../wilayah/dto/create-wilayah.dto");
const create_jemaat_dto_1 = require("./create-jemaat.dto");
var JenisKelamin;
(function (JenisKelamin) {
    JenisKelamin["L"] = "L";
    JenisKelamin["P"] = "P";
})(JenisKelamin || (JenisKelamin = {}));
var StatusKeanggotaan;
(function (StatusKeanggotaan) {
    StatusKeanggotaan["TETAP"] = "TETAP";
    StatusKeanggotaan["TITIPAN"] = "TITIPAN";
    StatusKeanggotaan["TAMU"] = "TAMU";
})(StatusKeanggotaan || (StatusKeanggotaan = {}));
var StatusPernikahan;
(function (StatusPernikahan) {
    StatusPernikahan["BELUM_MENIKAH"] = "BELUM_MENIKAH";
    StatusPernikahan["MENIKAH"] = "MENIKAH";
    StatusPernikahan["CERAI_HIDUP"] = "CERAI_HIDUP";
    StatusPernikahan["CERAI_MATI"] = "CERAI_MATI";
})(StatusPernikahan || (StatusPernikahan = {}));
var StatusSakramen;
(function (StatusSakramen) {
    StatusSakramen["SUDAH"] = "SUDAH";
    StatusSakramen["BELUM"] = "BELUM";
})(StatusSakramen || (StatusSakramen = {}));
class CreateJemaatWithRelationsDto extends create_jemaat_dto_1.CreateJemaatDto {
    wilayah;
    kelompok;
}
exports.CreateJemaatWithRelationsDto = CreateJemaatWithRelationsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => create_wilayah_dto_1.CreateWilayahDto, description: 'Data untuk membuat Wilayah baru atau menghubungkan ke yang sudah ada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_wilayah_dto_1.CreateWilayahDto),
    __metadata("design:type", create_wilayah_dto_1.CreateWilayahDto)
], CreateJemaatWithRelationsDto.prototype, "wilayah", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => create_kelompok_dto_1.CreateKelompokDto, description: 'Data untuk membuat Kelompok baru atau menghubungkan ke yang sudah ada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => create_kelompok_dto_1.CreateKelompokDto),
    __metadata("design:type", create_kelompok_dto_1.CreateKelompokDto)
], CreateJemaatWithRelationsDto.prototype, "kelompok", void 0);
//# sourceMappingURL=create-jemaat-with-relations.dto.js.map