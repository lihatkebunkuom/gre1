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
exports.WilayahController = void 0;
const common_1 = require("@nestjs/common");
const wilayah_service_1 = require("./wilayah.service");
const create_wilayah_dto_1 = require("./dto/create-wilayah.dto");
const update_wilayah_dto_1 = require("./dto/update-wilayah.dto");
const swagger_1 = require("@nestjs/swagger");
let WilayahController = class WilayahController {
    wilayahService;
    constructor(wilayahService) {
        this.wilayahService = wilayahService;
    }
    create(createWilayahDto) {
        return this.wilayahService.create(createWilayahDto);
    }
    findAll() {
        return this.wilayahService.findAll();
    }
    findOne(id) {
        return this.wilayahService.findOne(id);
    }
    update(id, updateWilayahDto) {
        return this.wilayahService.update(id, updateWilayahDto);
    }
    remove(id) {
        return this.wilayahService.remove(id);
    }
};
exports.WilayahController = WilayahController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Tambah wilayah baru' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Wilayah berhasil dibuat.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_wilayah_dto_1.CreateWilayahDto]),
    __metadata("design:returntype", void 0)
], WilayahController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil semua data wilayah' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WilayahController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil detail wilayah berdasarkan ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WilayahController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update data wilayah' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_wilayah_dto_1.UpdateWilayahDto]),
    __metadata("design:returntype", void 0)
], WilayahController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Hapus wilayah' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WilayahController.prototype, "remove", null);
exports.WilayahController = WilayahController = __decorate([
    (0, swagger_1.ApiTags)('Wilayah'),
    (0, common_1.Controller)('wilayah'),
    __metadata("design:paramtypes", [wilayah_service_1.WilayahService])
], WilayahController);
//# sourceMappingURL=wilayah.controller.js.map