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
exports.DocumentResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const document_service_1 = require("./document.service");
const create_document_input_1 = require("./dto/create-document.input");
const update_document_input_1 = require("./dto/update-document.input");
const document_entity_1 = require("./entities/document.entity");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
let DocumentResolver = class DocumentResolver {
    documentService;
    constructor(documentService) {
        this.documentService = documentService;
    }
    async createDocument(createDocumentInput, user) {
        return this.documentService.create(createDocumentInput, user.sub);
    }
    async findAllDocuments() {
        return this.documentService.findAll();
    }
    async findOneDocument(id) {
        return this.documentService.findOne(id);
    }
    async updateDocument(id, updateDocumentInput, user) {
        return this.documentService.update(id, updateDocumentInput, user.sub);
    }
    async removeDocument(id, user) {
        return this.documentService.remove(id, user.sub);
    }
};
exports.DocumentResolver = DocumentResolver;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => document_entity_1.Document),
    __param(0, (0, graphql_1.Args)('createDocumentInput')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_input_1.CreateDocumentInput, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "createDocument", null);
__decorate([
    (0, graphql_1.Query)(() => [document_entity_1.Document]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "findAllDocuments", null);
__decorate([
    (0, graphql_1.Query)(() => document_entity_1.Document),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "findOneDocument", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => document_entity_1.Document),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number })),
    __param(1, (0, graphql_1.Args)('updateDocumentInput')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_document_input_1.UpdateDocumentInput, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "updateDocument", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, graphql_1.Mutation)(() => document_entity_1.Document),
    __param(0, (0, graphql_1.Args)('id', { type: () => Number })),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DocumentResolver.prototype, "removeDocument", null);
exports.DocumentResolver = DocumentResolver = __decorate([
    (0, graphql_1.Resolver)(() => document_entity_1.Document),
    __metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentResolver);
//# sourceMappingURL=document.resolver.js.map