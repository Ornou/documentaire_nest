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
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bullmq_1 = require("bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const fs = require("fs");
const path = require("path");
let DocumentService = class DocumentService {
    prisma;
    configService;
    jwtService;
    documentQueue;
    constructor(prisma, configService, jwtService, documentQueue) {
        this.prisma = prisma;
        this.configService = configService;
        this.jwtService = jwtService;
        this.documentQueue = documentQueue;
    }
    async create(createDocumentInput, userId, file) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error('Utilisateur non trouvé');
            let fileUrl;
            const uploadDir = path.join(__dirname, '..', '..', 'uploads');
            await fs.promises.mkdir(uploadDir, { recursive: true });
            if (file) {
                const fileName = `${Date.now()}_${file.originalname}`;
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, file.buffer);
                fileUrl = `http://localhost:3000/uploads/${fileName}`;
            }
            else {
                const safeTitle = createDocumentInput.title.replace(/[^a-zA-Z0-9_-]/g, '_');
                const fileName = `${Date.now()}_${safeTitle}.txt`;
                const filePath = path.join(uploadDir, fileName);
                fs.writeFileSync(filePath, createDocumentInput.title);
                fileUrl = `http://localhost:3000/uploads/${fileName}`;
            }
            const now = new Date();
            const document = await this.prisma.document.create({
                data: {
                    title: createDocumentInput.title,
                    description: createDocumentInput.description,
                    fileUrl: fileUrl,
                    user: { connect: { id: userId } },
                    createdAt: now,
                    updatedAt: now,
                },
            });
            await this.documentQueue.add('document.created', {
                documentId: document.id,
                userId,
                timestamp: now,
            });
            return document;
        }
        catch (error) {
            throw new Error(error.message || 'Erreur lors de la création du document');
        }
    }
    async findAll() {
        return this.prisma.document.findMany({
            include: { user: true },
        });
    }
    async findOne(id) {
        const document = await this.prisma.document.findUnique({
            where: { id },
            include: { user: true },
        });
        if (!document) {
            throw new Error('Document non trouvé');
        }
        return document;
    }
    async update(id, updateDocumentInput, userId) {
        const document = await this.prisma.document.findUnique({
            where: { id },
        });
        if (!document) {
            throw new Error('Document non trouvé');
        }
        if (document.userId !== userId) {
            throw new Error('Accès refusé : vous ne pouvez pas modifier ce document.');
        }
        return this.prisma.document.update({
            where: { id },
            data: {
                title: updateDocumentInput.title ?? document.title,
                description: updateDocumentInput.description ?? document.description,
                fileUrl: updateDocumentInput.fileUrl ?? document.fileUrl,
                updatedAt: new Date(),
            },
        });
    }
    async remove(id, userId) {
        try {
            const document = await this.prisma.document.delete({
                where: { id },
            });
            await this.documentQueue.add('document.deleted', {
                documentId: document.id,
                userId: userId,
                timestamp: new Date(),
            });
            return document;
        }
        catch (error) {
            throw new Error(error.message || 'Erreur lors de la suppression');
        }
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bullmq_2.InjectQueue)('document')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        jwt_1.JwtService,
        bullmq_1.Queue])
], DocumentService);
//# sourceMappingURL=document.service.js.map