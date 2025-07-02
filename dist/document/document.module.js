"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bullmq_1 = require("@nestjs/bullmq");
const jwt_1 = require("@nestjs/jwt");
const document_service_1 = require("./document.service");
const document_resolver_1 = require("./document.resolver");
const document_consumer_1 = require("./document.consumer");
let DocumentModule = class DocumentModule {
};
exports.DocumentModule = DocumentModule;
exports.DocumentModule = DocumentModule = __decorate([
    (0, common_1.Module)({
        imports: [bullmq_1.BullModule.registerQueue({
                name: 'document',
            }),
            config_1.ConfigModule, jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET || 'secret', signOptions: { expiresIn: '1d' } })],
        providers: [document_resolver_1.DocumentResolver, document_service_1.DocumentService, document_consumer_1.DocumentConsumer],
        exports: [jwt_1.JwtModule]
    })
], DocumentModule);
//# sourceMappingURL=document.module.js.map