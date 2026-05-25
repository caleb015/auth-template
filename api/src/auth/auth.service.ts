import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password?: string): Promise<any> {
    if (password) {
      const user = await this.usersService.validateLocalUser(email, password);
      if (!user) return null;
      const { password: _, ...result } = user as any;
      return result;
    }

    const user = await this.usersService.getByEmail(email);
    if (!user) return null;
    return { id: user.id, email: user.email, provider: user.provider };
  }

  async login(user: { id?: string; email: string; provider: string; providerId?: string }): Promise<any> {
    if (user.id) {
      const payload = { email: user.email, provider: user.provider };
      return {
        access_token: this.jwtService.sign(payload, { subject: user.id }),
        user: { id: user.id, email: user.email, provider: user.provider },
      };
    }

    const existing = await this.usersService.getByProvider(user.provider, user.providerId || '');
    const savedUser = existing
      ? existing
      : await this.usersService.create({
          email: user.email,
          provider: user.provider,
          providerId: user.providerId || '',
        });

    const payload = { email: savedUser.email, provider: savedUser.provider };
    return {
      access_token: this.jwtService.sign(payload, { subject: savedUser.id }),
      user: { id: savedUser.id, email: savedUser.email, provider: savedUser.provider },
    };
  }

  async register(email: string, password: string) {
    return this.usersService.createLocalUser(email, password);
  }
}
