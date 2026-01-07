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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JemaatController = void 0;
const common_1 = require("@nestjs/common");
const jemaat_service_1 = require("./jemaat.service");
const create_jemaat_dto_1 = require("./dto/create-jemaat.dto");
const update_jemaat_dto_1 = require("./dto/update-jemaat.dto");
const create_jemaat_with_relations_dto_1 = require("./dto/create-jemaat-with-relations.dto");
const swagger_1 = require("@nestjs/swagger");
let JemaatController = class JemaatController {
    jemaatService;
    constructor(jemaatService) {
        this.jemaatService = jemaatService;
    }
    create(createJemaatDto) {
        return this.jemaatService.create(createJemaatDto);
    }
    createWithRelations(createJemaatWithRelationsDto) {
        return this.jemaatService.createJemaatWithRelations(createJemaatWithRelationsDto);
    }
    findAll(search) {
        return this.jemaatService.findAll(search);
    }
    findOne(id) {
        return this.jemaatService.findOne(id);
    }
    update(id, updateJemaatDto) {
        return this.jemaatService.update(id, updateJemaatDto);
    }
    remove(id) {
        return this.jemaatService.remove(id);
    }
};
exports.JemaatController = JemaatController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah data jemaat baru (tanpa relasi Wilayah/Kelompok)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data jemaat berhasil disimpan.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_jemaat_dto_1.CreateJemaatDto]),
    __metadata("design:returntype", void 0)
], JemaatController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('with-relations'),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah data jemaat baru beserta Wilayah dan Kelompok terkait' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Data jemaat beserta relasi berhasil disimpan.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_jemaat_with_relations_dto_1.CreateJemaatWithRelationsDto]),
    __metadata("design:returntype", void 0)
], JemaatController.prototype, "createWithRelations", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil daftar jemaat (Support Search)' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Cari nama atau no induk' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JemaatController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil detail jemaat berdasarkan ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JemaatController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update data jemaat' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_jemaat_dto_1.UpdateJemaatDto]),
    __metadata("design:returntype", void 0)
], JemaatController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus data jemaat' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JemaatController.prototype, "remove", null);
exports.JemaatController = JemaatController = __decorate([
    (0, swagger_1.ApiTags)('Jemaat'),
    (0, common_1.Controller)('jemaat'),
    __metadata("design:paramtypes", [jemaat_service_1.JemaatService])
], JemaatController);
//# sourceMappingURL=jemaat.controller.js.map