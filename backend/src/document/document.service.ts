import { Injectable } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

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
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const now = new Date();
      const document = await this.prisma.document.create({
        data: {
          title: createDocumentInput.title,
          description: createDocumentInput.description,
          fileUrl: createDocumentInput.fileUrl,
          user: {
            connect: { id: userId },
          },
          createdAt: now,
          updatedAt: now,
        },
      });

      // Envoie l'événement dans la queue
      await this.documentQueue.add('document.created', {
        documentId: document.id,
        userId: userId,
        timestamp: now,
      });

      return document;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la création');
    }
  }

  /**
   * Récupérer tous les documents
   */
  async findAll() {
    return this.prisma.document.findMany({
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

  /**
   * Supprimer un document par ID
   */
  async remove(id: number, userId: number) {
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
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la suppression');
    }
  }

}
