import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { EntityManager } from 'typeorm';
import { Role } from '../role/role.enum';
import { GetUsersFilteredDto } from './dto/get-users-filtered.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginatedListDto } from '../common/list/paginated-list.dto';
import { ProfileService } from '../profile/profile.service';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { HashService } from '../auth/auth.utils';

@Injectable()
export class UserService {
  constructor(
    private profileService: ProfileService,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    private hashService: HashService,
  ) {}

  async getUsers(filter: GetUsersFilteredDto): Promise<PaginatedListDto<User>> {
    return this.userRepository.getUsers(filter);
  }

  async getCurrentUser(user: User): Promise<User> {
    return await this.userRepository.getUserById(user.id);
  }

  async getUser(userId: number): Promise<User> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(
    createUserDto: CreateUserDto,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const { role, lastName, firstName, email } = createUserDto;

    const foundUser = await this.userRepository.findOne({
      where: {
        email: email,
      },
      loadEagerRelations: false,
    });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }

    const userToCreate = new User(email, role);

    userToCreate.profile = await this.profileService.createProfile(
      {
        firstName,
        lastName,
      },
      transactionalEntityManager,
    );

    await transactionalEntityManager.save(userToCreate);

    return userToCreate;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const { role, firstName, lastName, email } = updateUserDto;

    if (role !== Role.ADMIN) {
      const otherAdmins = await this.userRepository.getAdminExcept(id);

      if (!otherAdmins.length) {
        throw new BadRequestException('VALIDATION.USER_CANNOT_BE_UPDATED');
      }
    }

    const userToUpdate = await this.userRepository.getUser(id);

    if (email) {
      const foundUser = await this.userRepository.getUserByEmail(email);

      if (foundUser && foundUser.email !== email) {
        throw new ConflictException('VALIDATION.USER_EMAIL_EXISTS');
      }

      userToUpdate.email = email;
    }

    userToUpdate.role = role;

    await this.profileService.updateProfile(
      userToUpdate.profile,
      { firstName, lastName },
      transactionalEntityManager,
    );

    await transactionalEntityManager.save(userToUpdate);

    return userToUpdate;
  }

  async updateUserInfo(
    updateUserInfoDto: UpdateUserInfoDto,
    user: User,
    transactionalEntityManager: EntityManager,
  ): Promise<User> {
    const { lastName, firstName, password } = updateUserInfoDto;

    const userToUpdate = await this.userRepository.getUserById(user.id);

    if (password) {
      userToUpdate.salt = await this.hashService.generateSalt();
      userToUpdate.password = await this.hashService.hashPassword(
        updateUserInfoDto.password,
        userToUpdate.salt,
      );
    }

    await transactionalEntityManager.save(userToUpdate);

    userToUpdate.profile = await this.profileService.updateProfileInfo(
      userToUpdate.profile,
      {
        lastName: lastName,
        firstName: firstName,
      },
      transactionalEntityManager,
    );

    delete userToUpdate.password;
    delete userToUpdate.salt;

    return userToUpdate;
  }

  async deleteUser(
    id: number,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const userToDelete = await this.userRepository.getUser(id);

    if (!userToDelete) {
      throw new NotFoundException(`VALIDATION.USER_NOT_FOUND`);
    }

    if (userToDelete.role === Role.ADMIN) {
      const otherAdmins = await this.userRepository.getAdminExcept(id);

      if (!otherAdmins.length) {
        throw new BadRequestException('VALIDATION.USER_CANNOT_BE_DELETED');
      }
    }

    userToDelete.email += userToDelete.id;
    userToDelete.deletedAt = new Date();

    await this.profileService.deleteProfile(
      userToDelete.profile,
      transactionalEntityManager,
    );

    await transactionalEntityManager.save(userToDelete);
  }
}
