import { Test, TestingModule } from '@nestjs/testing';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      const decoded = { sub: 1 };
      const document = { id: 1, ...createDto, userId: 1, createdAt: new Date(), updatedAt: new Date() };

      mockConfigService.get.mockReturnValue('secret');
      mockJwtService.verify.mockReturnValue(decoded);
      mockDocumentService.create.mockResolvedValue(document);

      const result = await resolver.createDocument(createDto, context);

      expect(result).toEqual(document);
      expect(mockJwtService.verify).toHaveBeenCalledWith('faketoken', { secret: 'secret' });
      expect(mockDocumentService.create).toHaveBeenCalledWith(createDto, decoded);
    });

    it('should throw an error if token is not provided', async () => {
        const createDto = { title: 'Test', description: 'Test desc', fileUrl: 'url' };
        const context = { req: { headers: {} } };
        await expect(resolver.createDocument(createDto, context)).rejects.toThrow('Token JWT non fourni');
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
        const documents = [{ id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() }];
        mockDocumentService.findAll.mockResolvedValue(documents);
        const result = await resolver.findAll();
        expect(result).toEqual(documents);
    });
  });

  describe('findOne', () => {
    it('should return a single document', async () => {
        const document = { id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
        mockDocumentService.findOne.mockResolvedValue(document);
        const result = await resolver.findOne(1);
        expect(result).toEqual(document);
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
        const updateDto = { id: 1, title: 'Updated Title' };
        const document = { id: 1, title: 'Updated Title', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
        mockDocumentService.update.mockResolvedValue(document);
        const result = await resolver.updateDocument(updateDto);
        expect(result).toEqual(document);
        expect(mockDocumentService.update).toHaveBeenCalledWith(updateDto.id, updateDto);
    });
  });

  describe('removeDocument', () => {
    it('should remove a document', async () => {
        const document = { id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
        mockDocumentService.remove.mockResolvedValue(document);
        const result = await resolver.removeDocument(1);
        expect(result).toEqual(document);
        expect(mockDocumentService.remove).toHaveBeenCalledWith(1);
    });
  });
});
