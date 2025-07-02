import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const mockUserService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if validation is successful', async () => {
      const user = { id: 1, name: 'Test', email: 'test@example.com', password: 'hashedpassword' };
      mockUserService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const { password, ...expectedResult } = user;
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual(expectedResult);
    });

    it('should return null if user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = { id: 1, name: 'Test', email: 'test@example.com', password: 'hashedpassword' };
      mockUserService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, email: 'test@example.com', role: 'user' };
      const token = 'some-jwt-token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: user.email, sub: user.id, role: user.role });
    });
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const userInput = { name: 'Test', email: 'test@example.com', password: 'password' };
      const hashedPassword = 'hashedpassword';
      const createdUser = { id: 1, ...userInput, password: hashedPassword };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await service.register(userInput);
      expect(bcrypt.hash).toHaveBeenCalledWith(userInput.password, 10);
      expect(mockUserService.create).toHaveBeenCalledWith({ ...userInput, password: hashedPassword });
      expect(result).toEqual(createdUser);
    });
  });
}); 