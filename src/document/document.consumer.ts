import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('document')
export class DocumentConsumer extends WorkerHost {
  async process(job: Job<any>): Promise<any> {
    console.log('📥 Nouveau job reçu :', job.name, job.data);

    if (job.name === 'document.created') {
      // Traitement spécifique pour la création
      console.log(`Document créé avec ID ${job.data.documentId} par user ${job.data.userId}`);
      // ➔ Ici tu peux déclencher audit, notification, envoi de mail, etc.
    }

    if (job.name === 'document.deleted') {
      // Traitement spécifique pour la suppression
      console.log(`Document supprimé avec ID ${job.data.documentId} par user ${job.data.userId}`);
      // ➔ Ici tu peux supprimer des fichiers physiques, envoyer des alertes, etc.
    }

    return {};
  }
}
