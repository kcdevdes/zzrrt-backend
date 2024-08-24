import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/bearer-token.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('User API')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves user information by user ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the user',
    schema: { type: 'string' },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        // Add other user properties as needed
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getUserById(@Param('id') id: string, @Req() req) {
    this.usersService.authorizeRequest(req, id);
    return this.usersService.findUserById(id);
  }

  @ApiOperation({
    summary: 'Update user by ID',
    description: 'Updates user information by user ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the user',
    schema: { type: 'string' },
  })
  @ApiParam({
    name: 'UpdateUserDto',
    required: false,
    description: 'User information to be updated',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        response: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async updateUser(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateUserDto,
  ) {
    this.usersService.authorizeRequest(req, id);
    return this.usersService.updateUser(id, dto);
  }

  @ApiOperation({
    summary: 'Delete user by ID',
    description: 'Deletes user information by user ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier of the user',
    schema: { type: 'string' },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        response: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            response: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  async deleteUser(@Param('id') id: string, @Req() req) {
    this.usersService.authorizeRequest(req, id);
    return this.usersService.deleteUser(id);
  }
}
