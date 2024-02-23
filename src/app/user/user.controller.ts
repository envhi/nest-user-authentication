import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexUserSwagger } from './swagger/index-user.swagger';
import { CreateUserSwagger } from './swagger/create-user.swagger';
import { ShowUserSwagger } from './swagger/show-user.swagger';
import { UpdateUserSwagger } from './swagger/update-user.swagger';
import { BadRequestSwagger } from '../../helpers/swagger/bad-request.swagger'; // import pra nao dar erro no jest
import { NotFoundSwagger } from '../../helpers/swagger/not-found.swagger'; // import pra nao dar erro no jest

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'All users listed successfully',
    type: IndexUserSwagger,
    isArray: true,
  })
  async index() {
    return await this.userService.findAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'New user created successfully',
    type: CreateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid params',
    type: BadRequestSwagger,
  })
  @ApiOperation({ summary: 'Create a user' })
  async create(@Body() body: CreateUserDto) {
    return await this.userService.create(body);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'User data returned successfully',
    type: ShowUserSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  @ApiOperation({ summary: 'Find user data' })
  async show(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'User data updated successfully',
    type: UpdateUserSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid params',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  @ApiOperation({ summary: 'Update user data' })
  async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User data deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: NotFoundSwagger,
  })
  async destroy(@Param('id') id: number) {
    await this.userService.deleteById(id);
  }
}
