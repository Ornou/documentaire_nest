import { Injectable } from '@nestjs/common';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  create(createDocumentInput: CreateDocumentInput) {
    return this.prisma.document.create({
      data: {
        title: createDocumentInput.title,
        description: createDocumentInput.description,
        fileUrl: createDocumentInput.fileUrl,
        user: {
          connect: { id: createDocumentInput.userId },
        },
      },
    });
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