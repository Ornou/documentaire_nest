import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from "./entities/document.entity";
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(
    private readonly documentService: DocumentService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  @Mutation(() => Document)
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @Context() context
  ) {
    const token = context.req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Token JWT non fourni');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'secret',
      });

      return this.documentService.create(createDocumentInput, decoded);
    } catch (error) {
      throw new Error('Token JWT invalide');
    }
  }

  @Query(() => [Document], { name: 'document' })
  findAll() {
    return this.documentService.findAll();
  }

  @Query(() => Document, { name: 'document' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.documentService.findOne(id);
  }

  @Mutation(() => Document)
  updateDocument(@Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput) {
    return this.documentService.update(updateDocumentInput.id, updateDocumentInput);
  }

  @Mutation(() => Document)
  removeDocument(@Args('id', { type: () => Int }) id: number) {
    return this.documentService.remove(id);
  }
}
