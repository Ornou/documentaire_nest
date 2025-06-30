import { Injectable } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  /**
   * Créer un document lié à l'utilisateur connecté
   */
  async create(createDocumentInput: CreateDocumentInput, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return this.prisma.document.create({
      data: {
        title: createDocumentInput.title,
        description: createDocumentInput.description,
        fileUrl: createDocumentInput.fileUrl,
        user: {
          connect: { id: userId },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
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
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new Error('Document non trouvé');
    }

    if (document.userId !== userId) {
      throw new Error('Accès refusé : vous ne pouvez pas supprimer ce document.');
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }
}
