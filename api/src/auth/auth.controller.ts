import { Controller, Get, Req, Res, UseGuards, Post, Body, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport redirects to the OAuth provider — no body needed
  }

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const user = req.user as any;
    if (user.__error) {
      return res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(user.__error)}`);
    }
    res.redirect(`${frontendUrl}/auth/callback?token=${user.access_token}`);
  }

  @Get('oauth/facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {}

  @Get('callback/facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const user = req.user as any;
    if (user.__error) {
      return res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(user.__error)}`);
    }
    res.redirect(`${frontendUrl}/auth/callback?token=${user.access_token}`);
  }

  @Get('oauth/x')
  @UseGuards(AuthGuard('x'))
  xLogin() {}

  @Get('callback/x')
  @UseGuards(AuthGuard('x'))
  xCallback(@Req() req: Request, @Res() res: Response) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const user = req.user as any;
    if (user.__error) {
      return res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent(user.__error)}`);
    }
    res.redirect(`${frontendUrl}/auth/callback?token=${user.access_token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    return (req as any).user;
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body.email, body.password);
    const { password: _, ...result } = user as any;
    return result;
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user as any);
  }
}
