import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-dto';
import { Request } from 'express';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Faz login no sistema' })
  @ApiResponse({ status: 200, description: 'Login feito com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const tenantId = req['tenantId'];
    const user = await this.authService.validateUser(
      body.email,
      body.password,
      tenantId,
    );
    return this.authService.login(user);
  }
}
