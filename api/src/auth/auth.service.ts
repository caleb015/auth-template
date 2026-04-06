import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.getByEmail(email);
    if (user) {
      const { id, email, provider } = user;
      return { id, email, provider };
    }
    return null;
  }

  async login(user: { email: string; provider: string; providerId: string }) {
    const existing = await this.usersService.getByProvider(user.provider, user.providerId);
    const savedUser = existing
      ? existing
      : await this.usersService.create({ email: user.email, provider: user.provider, providerId: user.providerId });

    const payload = { email: savedUser.email, provider: savedUser.provider };
    return {
      access_token: this.jwtService.sign(payload, { subject: savedUser.id }),
      user: { id: savedUser.id, email: savedUser.email, provider: savedUser.provider },
    };
  }

  async me(id: string) {
    const user = await this.usersService.getByEmail(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
