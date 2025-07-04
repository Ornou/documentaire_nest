import { Test, TestingModule } from '@nestjs/testing';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const mockDocumentService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockJwtService = {
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn(),
};

describe('DocumentResolver', () => {
  let resolver: DocumentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentResolver,
        { provide: DocumentService, useValue: mockDocumentService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: 'BullQueue_document', useValue: { add: jest.fn() }},
        { provide: JwtAuthGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) } },
      ],
    }).compile();

    resolver = module.get<DocumentResolver>(DocumentResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createDocument', () => {
    it('should create a document', async () => {
      const createDto = { title: 'Test', description: 'Test desc', fileUrl: 'url' };
      const context = { req: { headers: { authorization: 'Bearer faketoken' } } };
      const document = { id: 1, ...createDto, userId: 1, createdAt: new Date(), updatedAt: new Date() };
      const user = { sub: 1 };
      mockDocumentService.create.mockResolvedValue(document);
      const result = await resolver.createDocument(createDto, user);
      expect(result).toEqual(document);
      expect(mockDocumentService.create).toHaveBeenCalledWith(createDto, user.sub);
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
        const documents = [{ id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() }];
        mockDocumentService.findAll.mockResolvedValue(documents);
        const result = await resolver.findAllDocuments(1);
        expect(result).toEqual(documents);
    });
  });

  describe('findOne', () => {
    it('should return a single document', async () => {
        const document = { id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
        mockDocumentService.findOne.mockResolvedValue(document);
        const result = await resolver.findOneDocument(1);
        expect(result).toEqual(document);
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
        const updateDto = { id: 1, title: 'Updated Title' };
        const user = { sub: 1 };
        const document = { id: 1, title: 'Updated Title', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
        mockDocumentService.update.mockResolvedValue(document);
        const result = await resolver.updateDocument(updateDto.id, updateDto, user);
        expect(result).toEqual(document);
        expect(mockDocumentService.update).toHaveBeenCalledWith(updateDto.id, updateDto, user.sub);
    });
  });

  describe('removeDocument', () => {
    it('should remove a document', async () => {
        const document = { id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
        const user = { sub: 1 };
        mockDocumentService.remove.mockResolvedValue(document);
        const result = await resolver.removeDocument(1,user);
        expect(result).toEqual(document);
        expect(mockDocumentService.remove).toHaveBeenCalledWith(1,user.sub);
    });
  });
});
