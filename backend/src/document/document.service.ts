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
  async create(createDocumentInput: CreateDocumentInput, userId: number, file?: Express.Multer.File) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('Utilisateur non trouvé');

      let fileUrl: string;
      const uploadDir = path.join(__dirname, '..', '..', 'uploads');
      await fs.promises.mkdir(uploadDir, { recursive: true });

      if (file) {
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        fileUrl = `http://localhost:3000/uploads/${fileName}`;
      } else {
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
    console.log('Suppression du document avec l\'ID :', id);
    try {
      const document = await this.prisma.document.delete({
        where: { id },
      });

      console.log(document);

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
