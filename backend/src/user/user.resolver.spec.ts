import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';

const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserInput: CreateUserInput = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const createdUser = { id: 1, ...createUserInput, createdAt: new Date(), updatedAt: new Date() };
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await resolver.createUser(createUserInput);
      expect(result).toEqual(createdUser);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1, name: 'Test User', email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() }];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await resolver.findAll();
      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await resolver.findOne(1);
      expect(result).toEqual(user);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserInput = { id: 1, password: 'newpassword' };
      const updatedUser = { id: 1, name: 'Test User', email: 'test@example.com', password: 'newpassword', createdAt: new Date(), updatedAt: new Date() };
      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await resolver.updateUser(updateUserInput);
      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(updateUserInput.id, updateUserInput);
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com', password: 'password', createdAt: new Date(), updatedAt: new Date() };
      mockUserService.remove.mockResolvedValue(user);

      const result = await resolver.removeUser(1);
      expect(result).toEqual(user);
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });
  });
});
