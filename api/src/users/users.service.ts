import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.prisma.user.findFirst({ where: { provider, providerId } });
  }

  async create(data: { email: string; provider: string; providerId: string }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async createLocalUser(email: string, plainPassword: string): Promise<User> {
    const hashed = await bcrypt.hash(plainPassword, 10);
    return this.prisma.user.create({
      data: {
        email,
        password: hashed,
        provider: 'local',
      },
    });
  }

  async validateLocalUser(email: string, plainPassword: string): Promise<User | null> {
    const user = await this.getByEmail(email);
    if (!user || !user.password) return null;
    const valid = await bcrypt.compare(plainPassword, user.password);
    if (!valid) return null;
    return user;
  }
}
