import { Controller, Get, Param, Query, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

const ALLOWED_PROVIDERS = ['google', 'facebook', 'twitter', 'x'];

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('oauth/:provider')
  async oauthRedirect(@Param('provider') provider: string, @Res() res: Response) {
    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return res.status(400).json({ error: 'Provider not supported' });
    }

    // Simulated flow for Phase 2 template if no external OAuth configured.
    // In real flow we would use passport strategy.
    return res.json({ message: `Use /auth/callback/${provider}?email=` });
  }

  @Get('callback/:provider')
  async oauthCallback(
    @Param('provider') provider: string,
    @Query('email') email = 'teacher@example.com',
    @Res() res: Response,
  ) {
    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return res.status(400).json({ error: 'Provider not supported' });
    }

    const providerId = email;
    const payload = await this.authService.login({ email: String(email), provider, providerId });
    return res.json(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const user = await this.authService.register(body.email, body.password);
    const { password: _, ...result } = user as any;
    return result;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
}
