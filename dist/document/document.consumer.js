"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
let DocumentConsumer = class DocumentConsumer extends bullmq_1.WorkerHost {
    async process(job) {
        console.log('📥 Nouveau job reçu :', job.name, job.data);
        if (job.name === 'document.created') {
            console.log(`Document créé avec ID ${job.data.documentId} par user ${job.data.userId}`);
        }
        if (job.name === 'document.deleted') {
            console.log(`Document supprimé avec ID ${job.data.documentId} par user ${job.data.userId}`);
        }
        return {};
    }
};
exports.DocumentConsumer = DocumentConsumer;
exports.DocumentConsumer = DocumentConsumer = __decorate([
    (0, bullmq_1.Processor)('document')
], DocumentConsumer);
//# sourceMappingURL=document.consumer.js.map