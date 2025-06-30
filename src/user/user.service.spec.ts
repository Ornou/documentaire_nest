import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserInput = { name:'John Doe' ,email: 'test@example.com', password: 'password' };
      const createdUser = { id: 1, ...createUserInput, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserInput);
      expect(result).toEqual(createdUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data: createUserInput });
    });

    it('should throw an error if user already exists', async () => {
      const createUserInput = { name:'John Doe',email: 'test@example.com', password: 'password' };
      const existingUser = { id: 1, ...createUserInput, createdAt: new Date(), updatedAt: new Date() };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(service.create(createUserInput)).rejects.toThrow('Un utilisateur avec cet email existe déjà');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() }];
      mockPrismaService.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserInput = { id: 1, password: 'newpassword' };
      const updatedUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'newpassword', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserInput);
      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateUserInput });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.user.delete.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(result).toEqual(user);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
