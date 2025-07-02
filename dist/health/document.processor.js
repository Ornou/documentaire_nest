"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DocumentProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let DocumentProcessor = DocumentProcessor_1 = class DocumentProcessor extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(DocumentProcessor_1.name);
    async process(job) {
        this.logger.log(`🚀 Début du traitement du job ID: ${job.id}`);
        this.logger.log(`📋 Données du job: ${JSON.stringify(job.data)}`);
        try {
            await job.updateProgress(10);
            this.logger.log(`⏳ Étape 1/5: Initialisation...`);
            await this.delay(1000);
            await job.updateProgress(30);
            this.logger.log(`✅ Étape 2/5: Validation des données...`);
            await this.delay(1500);
            await job.updateProgress(60);
            this.logger.log(`⚙️ Étape 3/5: Traitement principal...`);
            await this.delay(2000);
            await job.updateProgress(80);
            this.logger.log(`💾 Étape 4/5: Sauvegarde...`);
            await this.delay(1000);
            await job.updateProgress(100);
            this.logger.log(`🎉 Étape 5/5: Finalisation...`);
            await this.delay(500);
            const result = {
                success: true,
                jobId: job.id,
                processedAt: new Date().toISOString(),
                message: 'Job traité avec succès',
                data: job.data,
            };
            this.logger.log(`✅ Job ${job.id} terminé avec succès`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Erreur lors du traitement du job ${job.id}:`, error);
            throw error;
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};
exports.DocumentProcessor = DocumentProcessor;
exports.DocumentProcessor = DocumentProcessor = DocumentProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('document')
], DocumentProcessor);
//# sourceMappingURL=document.processor.js.map