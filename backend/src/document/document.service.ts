import { Injectable } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateDocumentInput } from './dto/update-document.input';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectQueue('document') private documentQueue: Queue,
  ) {}

  /**
   * Créer un document lié à l'utilisateur connecté
   */
  async create(createDocumentInput: CreateDocumentInput, userId: number) {
    try {
      // Vérifier que l'utilisateur existe
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const now = new Date();
      const documentData: any = {
        title: createDocumentInput.title,
        fileUrl: createDocumentInput.fileUrl, // Le fileUrl est maintenant fourni par le résolveur
        user: { connect: { id: userId } },
        createdAt: now,
        updatedAt: now,
      };

      // Ajouter la description uniquement si elle est fournie
      if (createDocumentInput.description !== undefined) {
        documentData.description = createDocumentInput.description;
      }

      const document = await this.prisma.document.create({
        data: documentData,
      });

      await this.documentQueue.add('document.created', {
        documentId: document.id,
        userId,
        timestamp: now,
      });

      return document;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la création du document');
    }
  }

  /**
   * Récupérer tous les documents
   */
  async findAll() {
    return await this.prisma.document.findMany({
      include: { user: true },
    });
  }

  /**
   * Récupérer un document par ID
   */
  async findOne(id: number) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!document) {
      throw new Error('Document non trouvé');
    }

    return document;
  }

  /**
   * Mettre à jour un document par ID
   */
  async update(id: number, updateDocumentInput: UpdateDocumentInput, userId: number) {
    // Démarrer une transaction pour assurer l'atomicité des opérations
    return await this.prisma.$transaction(async (prisma) => {
      // Vérifier que le document existe et appartient à l'utilisateur
      const document = await prisma.document.findUnique({
        where: { id },
      });

      if (!document) {
        throw new Error('Document non trouvé');
      }

      if (document.userId !== userId) {
        throw new Error('Accès refusé : vous ne pouvez pas modifier ce document');
      }

      // Préparer les données de mise à jour
      const updateData: any = {
        title: updateDocumentInput.title,
        updatedAt: new Date(),
      };

      // Mettre à jour la description si fournie
      if (updateDocumentInput.description !== undefined) {
        updateData.description = updateDocumentInput.description;
      }

      // Mettre à jour le fichier si un nouveau est fourni
      if (updateDocumentInput.fileUrl !== undefined) {
        // Supprimer l'ancien fichier s'il existe et qu'un nouveau est fourni
        if (document.fileUrl && document.fileUrl !== updateDocumentInput.fileUrl) {
          const filePath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            path.basename(document.fileUrl),
          );
          
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (error) {
              console.error('Erreur lors de la suppression de l\'ancien fichier:', error);
              // Ne pas échouer la mise à jour si la suppression échoue
            }
          }
        }
        updateData.fileUrl = updateDocumentInput.fileUrl;
      }

      // Effectuer la mise à jour
      const updatedDocument = await prisma.document.update({
        where: { id },
        data: updateData,
      });

      // Ajouter une tâche de notification
      await this.documentQueue.add('document.updated', {
        documentId: updatedDocument.id,
        userId,
        timestamp: new Date(),
      });

      return updatedDocument;
    });
  }

  /**
   * Supprimer un document par ID
   */
  async remove(id: number, userId: number) {
    try {
      // Démarrer une transaction pour assurer l'atomicité des opérations
      return await this.prisma.$transaction(async (prisma) => {
        // Récupérer le document avec vérification des permissions
        const document = await prisma.document.findUnique({
          where: { id },
        });

        if (!document) {
          throw new Error('Document non trouvé');
        }

        if (document.userId !== userId) {
          throw new Error('Accès refusé : vous ne pouvez pas supprimer ce document');
        }

        // Supprimer le fichier associé s'il existe
        if (document.fileUrl) {
          try {
            console.log('Tentative de suppression du fichier pour le document:', document);
            
            // Extraire le nom du fichier de l'URL
            const fileName = document.fileUrl.split('/').pop();
            console.log('Nom du fichier extrait:', fileName);
            
            if (fileName) {
              // Chemin absolu vers le dossier uploads à la racine du projet
              const projectRoot = path.join(__dirname, '..', '..', '..');
              const uploadsDir = path.join(projectRoot, '..', 'uploads');
              console.log('Dossier des uploads:', uploadsDir);
              
              // Créer le chemin complet du fichier
              const filePath = path.join(uploadsDir, fileName);
              console.log('Chemin complet du fichier à supprimer:', filePath);
              
              // Vérifier si le fichier existe avant de le supprimer
              if (fs.existsSync(filePath)) {
                console.log('Le fichier existe, tentative de suppression...');
                fs.unlinkSync(filePath);
                console.log(`Fichier supprimé avec succès: ${filePath}`);
              } else {
                console.warn(`Le fichier n'existe pas à l'emplacement: ${filePath}`);
                
                // Essayer avec un chemin alternatif (au cas où)
                const altPath = path.join(projectRoot, 'uploads', fileName);
                if (fs.existsSync(altPath)) {
                  console.log('Fichier trouvé avec le chemin alternatif, suppression...');
                  fs.unlinkSync(altPath);
                  console.log(`Fichier supprimé avec succès: ${altPath}`);
                } else {
                  console.warn(`Le fichier n'existe pas non plus à l'emplacement: ${altPath}`);
                }
              }
            } else {
              console.warn('Impossible d\'extraire le nom du fichier depuis l\'URL:', document.fileUrl);
            }
          } catch (error) {
            console.error('Erreur lors de la suppression du fichier:', error);
            // Ne pas arrêter le processus de suppression si la suppression du fichier échoue
            // mais enregistrer l'erreur dans les logs
          }
        }

        // Supprimer le document de la base de données
        const deletedDocument = await prisma.document.delete({
          where: { id },
        });

        // Ajouter une tâche de notification après la suppression
        await this.documentQueue.add('document.deleted', {
          documentId: id,
          userId,
          timestamp: new Date(),
        });

        return deletedDocument;
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      throw new Error(error.message || 'Erreur lors de la suppression du document');
    }
  }
}
