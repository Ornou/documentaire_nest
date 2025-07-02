import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor('document')
export class DocumentProcessor extends WorkerHost {
  private readonly logger = new Logger(DocumentProcessor.name);

  async process(job: Job): Promise<any> {
    this.logger.log(`🚀 Début du traitement du job ID: ${job.id}`);
    this.logger.log(`📋 Données du job: ${JSON.stringify(job.data)}`);

    try {
      // Étape 1: Initialisation
      await job.updateProgress(10);
      this.logger.log(`⏳ Étape 1/5: Initialisation...`);
      await this.delay(1000);

      // Étape 2: Validation
      await job.updateProgress(30);
      this.logger.log(`✅ Étape 2/5: Validation des données...`);
      await this.delay(1500);

      // Étape 3: Traitement principal
      await job.updateProgress(60);
      this.logger.log(`⚙️ Étape 3/5: Traitement principal...`);
      await this.delay(2000);

      // Étape 4: Sauvegarde
      await job.updateProgress(80);
      this.logger.log(`💾 Étape 4/5: Sauvegarde...`);
      await this.delay(1000);

      // Étape 5: Finalisation
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
    } catch (error) {
      this.logger.error(
        `❌ Erreur lors du traitement du job ${job.id}:`,
        error,
      );
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
