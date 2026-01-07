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
exports.CreateJemaatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
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
class CreateJemaatDto {
    nomorInduk;
    nama;
    jenisKelamin;
    tempatLahir;
    tanggalLahir;
    statusAktif;
    statusKeanggotaan;
    tanggalBergabung;
    fotoUrl;
    catatanKhusus;
    noHp;
    email;
    alamat;
    kota;
    provinsi;
    statusPernikahan;
    namaPasangan;
    jumlahAnak;
    isKepalaKeluarga;
    noKK;
    statusBaptis;
    tanggalBaptis;
    gerejaBaptis;
    statusSidi;
    tanggalSidi;
    pendetaSidi;
    pendidikan;
    pekerjaan;
    instansi;
    minatPelayanan;
    pelayananDiikuti;
    peranDalamKelompok;
    wilayahId;
    kelompokId;
}
exports.CreateJemaatDto = CreateJemaatDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'GM-001', description: 'Nomor Induk Jemaat (Jika kosong akan auto-generate)' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "nomorInduk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Andi Pratama' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "nama", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: JenisKelamin, example: 'L' }),
    (0, class_validator_1.IsEnum)(JenisKelamin),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "jenisKelamin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jakarta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "tempatLahir", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1990-01-01T00:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "tanggalLahir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateJemaatDto.prototype, "statusAktif", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StatusKeanggotaan, default: 'TETAP' }),
    (0, class_validator_1.IsEnum)(StatusKeanggotaan),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "statusKeanggotaan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "" ? undefined : value),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "tanggalBergabung", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "fotoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "catatanKhusus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "noHp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "" ? undefined : value),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "alamat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "kota", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "provinsi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StatusPernikahan, default: 'BELUM_MENIKAH' }),
    (0, class_validator_1.IsEnum)(StatusPernikahan),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "statusPernikahan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "namaPasangan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateJemaatDto.prototype, "jumlahAnak", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateJemaatDto.prototype, "isKepalaKeluarga", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "noKK", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StatusSakramen, default: 'BELUM' }),
    (0, class_validator_1.IsEnum)(StatusSakramen),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "statusBaptis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "" ? undefined : value),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "tanggalBaptis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "gerejaBaptis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: StatusSakramen, default: 'BELUM' }),
    (0, class_validator_1.IsEnum)(StatusSakramen),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "statusSidi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "" ? undefined : value),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "tanggalSidi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "pendetaSidi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "pendidikan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "pekerjaan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "instansi", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "minatPelayanan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "pelayananDiikuti", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "peranDalamKelompok", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "" ? undefined : value),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "wilayahId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "" ? undefined : value),
    __metadata("design:type", String)
], CreateJemaatDto.prototype, "kelompokId", void 0);
//# sourceMappingURL=create-jemaat.dto.js.map