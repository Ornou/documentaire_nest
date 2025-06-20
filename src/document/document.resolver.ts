import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

@Resolver(() => Document)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}

  @Mutation(() => Document)
  createDocument(@Args('createDocumentInput') createDocumentInput: CreateDocumentInput) {
    return this.documentService.create(createDocumentInput);
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
