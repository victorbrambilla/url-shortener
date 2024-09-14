import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
  ): Promise<User> {
    const tenantId = req['tenantId'];
    return this.userService.create(createUserDto, tenantId);
  }
}
