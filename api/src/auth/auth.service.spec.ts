import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  password: 'hashed',
  provider: 'local',
  providerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUsersService = {
  validateLocalUser: jest.fn(),
  getByEmail: jest.fn(),
  getByProvider: jest.fn(),
  create: jest.fn(),
  createLocalUser: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ── validateUser ────────────────────────────────────────────────────────────

  describe('validateUser', () => {
    it('returns user without password on valid local credentials', async () => {
      mockUsersService.validateLocalUser.mockResolvedValue(mockUser);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
    });

    it('returns null when local credentials are invalid', async () => {
      mockUsersService.validateLocalUser.mockResolvedValue(null);
      const result = await service.validateUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });

    it('returns null when user has no password set (OAuth user attempting local login)', async () => {
      mockUsersService.validateLocalUser.mockResolvedValue(null);
      const result = await service.validateUser('oauth@example.com', 'password');
      expect(result).toBeNull();
    });

    it('returns user by email when no password provided', async () => {
      mockUsersService.getByEmail.mockResolvedValue(mockUser);
      const result = await service.validateUser('test@example.com');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        provider: mockUser.provider,
      });
    });

    it('returns null when email not found and no password provided', async () => {
      mockUsersService.getByEmail.mockResolvedValue(null);
      const result = await service.validateUser('unknown@example.com');
      expect(result).toBeNull();
    });
  });

  // ── login (local path) ──────────────────────────────────────────────────────

  describe('login — local path (user has id)', () => {
    it('returns access_token and user when id is present', async () => {
      const result = await service.login({
        id: 'user-123',
        email: 'test@example.com',
        provider: 'local',
      });
      expect(result.access_token).toBe('signed-token');
      expect(result.user.email).toBe('test@example.com');
      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { email: 'test@example.com', provider: 'local' },
        { subject: 'user-123' },
      );
    });
  });

  // ── login (OAuth path) ──────────────────────────────────────────────────────

  describe('login — OAuth path (no id)', () => {
    it('returns existing user when found by provider', async () => {
      mockUsersService.getByProvider.mockResolvedValue(mockUser);
      const result = await service.login({
        email: 'test@example.com',
        provider: 'google',
        providerId: 'google-001',
      });
      expect(result.access_token).toBe('signed-token');
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });

    it('does not check email when provider match is found', async () => {
      mockUsersService.getByProvider.mockResolvedValue(mockUser);
      await service.login({
        email: 'test@example.com',
        provider: 'google',
        providerId: 'google-001',
      });
      expect(mockUsersService.getByEmail).not.toHaveBeenCalled();
    });

    it('creates a new user when provider and email are both new', async () => {
      mockUsersService.getByProvider.mockResolvedValue(null);
      mockUsersService.getByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      const result = await service.login({
        email: 'new@example.com',
        provider: 'google',
        providerId: 'google-002',
      });
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        provider: 'google',
        providerId: 'google-002',
      });
      expect(result.access_token).toBe('signed-token');
    });

    it('defaults providerId to empty string when omitted', async () => {
      mockUsersService.getByProvider.mockResolvedValue(null);
      mockUsersService.getByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUser);
      await service.login({ email: 'new@example.com', provider: 'google' });
      expect(mockUsersService.getByProvider).toHaveBeenCalledWith('google', '');
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ providerId: '' }),
      );
    });

    it('throws ConflictException when email exists under a different provider', async () => {
      mockUsersService.getByProvider.mockResolvedValue(null);
      mockUsersService.getByEmail.mockResolvedValue({
        ...mockUser,
        provider: 'google',
      });
      await expect(
        service.login({
          email: 'test@example.com',
          provider: 'facebook',
          providerId: 'fb-001',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('conflict error message names the existing provider', async () => {
      mockUsersService.getByProvider.mockResolvedValue(null);
      mockUsersService.getByEmail.mockResolvedValue({
        ...mockUser,
        provider: 'google',
      });
      await expect(
        service.login({
          email: 'test@example.com',
          provider: 'facebook',
          providerId: 'fb-001',
        }),
      ).rejects.toThrow('google');
    });
  });

  // ── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    it('delegates to createLocalUser', async () => {
      mockUsersService.createLocalUser.mockResolvedValue(mockUser);
      const result = await service.register('test@example.com', 'password');
      expect(mockUsersService.createLocalUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
      expect(result).toEqual(mockUser);
    });

    it('propagates error when email is already registered', async () => {
      mockUsersService.createLocalUser.mockRejectedValue(
        new Error('Unique constraint failed'),
      );
      await expect(
        service.register('test@example.com', 'password'),
      ).rejects.toThrow('Unique constraint failed');
    });
  });
});
