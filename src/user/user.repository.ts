import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { GetUsersFilteredDto } from './dto/get-users-filtered.dto';
import { Role } from '../role/role.enum';
import { PaginatedListDto } from '../common/list/paginated-list.dto';
import { getFilteredPaginatedList } from '../common/list/list-query.helper';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserByEmail(email: string, withPassword?: boolean): Promise<User> {
    const query = this.createQueryBuilder('user');
    query.leftJoinAndSelect('user.profile', 'profile');

    if (withPassword) {
      query.addSelect(['user.password', 'user.salt']);
    }

    query.andWhere('user.email = :email', {
      email,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUsers(filter: GetUsersFilteredDto): Promise<PaginatedListDto<User>> {
    const { role } = filter;

    const query = this.createQueryBuilder('user');
    query.leftJoinAndSelect('user.profile', 'profile');

    if (role) {
      query.andWhere('user.role = :role', { role: role });
    }

    try {
      return await getFilteredPaginatedList(
        query,
        filter,
        ['user.email', 'user.role', 'profile.firstName', 'profile.lastName'],
        ['user.email', 'user.role', 'profile.firstName', 'profile.lastName'],
      );
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUser(userId: number): Promise<User> {
    const query = this.createQueryBuilder('user');

    query.leftJoinAndSelect('user.profile', 'profile');

    query.andWhere('user.id = :userId', {
      userId: userId,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAdminExcept(userId: number): Promise<User[]> {
    const query = this.createQueryBuilder('user');

    query.andWhere('user.id != :userId AND user.role = :role', {
      userId: userId,
      role: Role.ADMIN,
    });

    try {
      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserById(userId: number): Promise<User> {
    const query = this.createQueryBuilder('user');

    query.leftJoinAndSelect('user.profile', 'profile');
    query.leftJoinAndSelect('profile.profileImage', 'profileImage');

    query.andWhere('user.id = :userId', { userId });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserByRegistrationCode(registrationToken: string): Promise<User> {
    const query = this.createQueryBuilder('user');

    query.andWhere('user.registrationToken = :registrationToken', {
      registrationToken: registrationToken,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getUserByEmailAndConfirmationToken(
    email: string,
    confirmationToken: string,
  ): Promise<User> {
    const query = this.createQueryBuilder('user');

    query.andWhere('(lower(user.email) = lower(:email))', { email: email });
    query.andWhere('user.confirmationToken = :confirmationToken', {
      confirmationToken: confirmationToken,
    });

    try {
      return await query.getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
