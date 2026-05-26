import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
  password: '$2b$10$hashedpassword',
  provider: 'local',
  providerId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // ── getByEmail ──────────────────────────────────────────────────────────────

  describe('getByEmail', () => {
    it('returns user when found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.getByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('returns null when not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.getByEmail('unknown@example.com');
      expect(result).toBeNull();
    });
  });

  // ── getByProvider ───────────────────────────────────────────────────────────

  describe('getByProvider', () => {
    it('returns user when found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      const result = await service.getByProvider('google', 'google-001');
      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { provider: 'google', providerId: 'google-001' },
      });
    });

    it('returns null when not found', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);
      const result = await service.getByProvider('google', 'unknown-id');
      expect(result).toBeNull();
    });
  });

  // ── createLocalUser ─────────────────────────────────────────────────────────

  describe('createLocalUser', () => {
    it('hashes the password before storing', async () => {
      mockPrisma.user.create.mockResolvedValue(mockUser);
      await service.createLocalUser('test@example.com', 'plaintext');
      const storedPassword = mockPrisma.user.create.mock.calls[0][0].data.password;
      expect(storedPassword).not.toBe('plaintext');
      expect(storedPassword).toMatch(/^\$2[ab]\$\d+\$/);
    });

    it('stores provider as local', async () => {
      mockPrisma.user.create.mockResolvedValue(mockUser);
      await service.createLocalUser('test@example.com', 'password');
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ provider: 'local' }) }),
      );
    });

    it('propagates error on duplicate email', async () => {
      mockPrisma.user.create.mockRejectedValue(new Error('Unique constraint failed'));
      await expect(
        service.createLocalUser('test@example.com', 'password'),
      ).rejects.toThrow('Unique constraint failed');
    });
  });

  // ── validateLocalUser ───────────────────────────────────────────────────────

  describe('validateLocalUser', () => {
    it('returns user when password matches', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashed });

      const result = await service.validateLocalUser('test@example.com', 'correct');
      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
    });

    it('returns null when password does not match', async () => {
      const hashed = await bcrypt.hash('correct', 10);
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, password: hashed });

      const result = await service.validateLocalUser('test@example.com', 'wrong');
      expect(result).toBeNull();
    });

    it('returns null when user is not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      const result = await service.validateLocalUser('unknown@example.com', 'password');
      expect(result).toBeNull();
    });

    it('returns null when user has no password set (OAuth user)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, password: null });
      const result = await service.validateLocalUser('oauth@example.com', 'password');
      expect(result).toBeNull();
    });
  });
});
