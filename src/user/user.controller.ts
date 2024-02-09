import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../role/roles.guard';
import { UserService } from './user.service';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { ParseValidatedIntPipe } from '../common/pipes/parse-validated-int.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Connection } from 'typeorm';
import { PaginatedListDto } from '../common/list/paginated-list.dto';
import { GetUsersFilteredDto } from './dto/get-users-filtered.dto';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private connection: Connection,
  ) {}

  @Get()
  getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilteredDto,
  ): Promise<PaginatedListDto<User>> {
    return this.userService.getUsers(filterDto);
  }

  @Get('/me')
  @Roles(Role.OWNER)
  getCurrentUser(@GetUser() user: User): Promise<User> {
    return this.userService.getCurrentUser(user);
  }

  @Get('/:id')
  getUser(@Param('id', new ParseValidatedIntPipe()) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.userService.createUser(
          createUserDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Patch('/update-info')
  @Roles(Role.OWNER)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateUserInfo(
    @Body() updateUserInfoDto: UpdateUserInfoDto,
    @GetUser() user: User,
  ): Promise<User> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.userService.updateUserInfo(
          updateUserInfoDto,
          user,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @Param('id', new ParseValidatedIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.userService.updateUser(
          id,
          updateUserDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id', new ParseValidatedIntPipe()) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.userService.deleteUser(
          id,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }
}
