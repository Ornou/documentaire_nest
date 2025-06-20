import { Injectable, ExecutionContext } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async create(createDocumentInput: CreateDocumentInput, decoded: any) {
    if (!decoded) {
      throw new Error('Token JWT non fourni');
    }

    try {
      // Vérifier si l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const now = new Date();
      return this.prisma.document.create({
        data: {
          title: createDocumentInput.title,
          description: createDocumentInput.description,
          fileUrl: createDocumentInput.fileUrl,
          user: {
            connect: { id: decoded.sub },
          },
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (error) {
      throw new Error('Token JWT invalide');
    }
  }

  findAll() {
    return this.prisma.document.findMany({
      include: { user: true }, // optionnel : si tu veux inclure les infos de l'utilisateur
    });
  }

  findOne(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  update(id: number, updateDocumentInput: UpdateDocumentInput) {
    return this.prisma.document.update({
      where: { id },
      data: {
        title: updateDocumentInput.title,
        description: updateDocumentInput.description,
        fileUrl: updateDocumentInput.fileUrl,
      },
    });
  }

  remove(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}