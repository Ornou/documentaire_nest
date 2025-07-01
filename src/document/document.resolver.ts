import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { Document } from "./entities/document.entity";
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @CurrentUser() user: any,
  ) {
    return this.documentService.create(createDocumentInput, user.sub);
  }

  @Query(() => [Document])
  @UseGuards(JwtAuthGuard)
  async findAllDocuments() {
    return this.documentService.findAll();
  }

  @Query(() => Document)
  @UseGuards(JwtAuthGuard)
  async findOneDocument(@Args('id', { type: () => Number }) id: number) {
    return this.documentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async updateDocument(
    @Args('id', { type: () => Number }) id: number,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
    @CurrentUser() user: any,
  ) {
    return this.documentService.update(id, updateDocumentInput, user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Document)
  async removeDocument(
    @Args('id', { type: () => Number }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.documentService.remove(id, user.sub);
  }
}
