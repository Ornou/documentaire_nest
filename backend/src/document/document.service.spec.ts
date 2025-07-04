import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

const mockPrismaService = {
  document: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: JwtService, useValue: { verify: jest.fn() } },
        {provide: 'BullQueue_document', useValue: { add: jest.fn() }},
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a document', async () => {
      const createDto = { title: 'Test', description: 'Test desc', fileUrl: 'http://test.com/file.pdf' };
      const user = { id: 1, email: 'test@test.com', name: 'Test User' };
      const document = { id: 1, ...createDto, userId: 1, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.document.create.mockResolvedValue(document);

      const result = await service.create(createDto, user.id);
      expect(result).toEqual(document);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(mockPrismaService.document.create).toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
        const createDto = { title: 'Test', description: 'Test desc', fileUrl: 'http://test.com/file.pdf' };
        const userId = 1;
        mockPrismaService.user.findUnique.mockResolvedValue(null);
        await expect(service.create(createDto, userId)).rejects.toThrow('Utilisateur non trouvé');
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      const documents = [{ id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() }];
      mockPrismaService.document.findMany.mockResolvedValue(documents);
      const result = await service.findAll(1);
      expect(result).toEqual(documents);
    });
  });

  describe('findOne', () => {
    it('should return a single document', async () => {
      const document = { id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.document.findUnique.mockResolvedValue(document);
      const result = await service.findOne(1);
      expect(result).toEqual(document);
    });
  });

  // describe('update', () => {
  //   it('should update a document', async () => {
  //       const updateDto = { id: 1, title: 'Updated Title' };
  //       const document = { id: 1, title: 'Updated Title', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
  //       mockPrismaService.document.update.mockResolvedValue(document);
  //       const result = await service.update(1, updateDto,document.userId);
  //       expect(result).toEqual(document);
  //   });
  // });

  // describe('remove', () => {
  //   it('should remove a document', async () => {
  //       const document = { id: 1, title: 'Test', description: 'Test desc', fileUrl: 'url', userId: 1, createdAt: new Date(), updatedAt: new Date() };
  //       mockPrismaService.document.delete.mockResolvedValue(document);
  //       const result = await service.remove(1,document.userId);
  //       expect(result).toEqual(document);
  //   });
  // });
});
