import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileRepository } from './profile.repository';
import { Profile } from './profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,
  ) {}

  async createProfile(
    createProfileDto: CreateProfileDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Profile> {
    const { firstName, lastName } = createProfileDto;

    const profile = new Profile(firstName, lastName);

    await transactionalEntityManager.save(profile);

    return profile;
  }

  async updateProfile(
    profile: Profile,
    createProfileDto: CreateProfileDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Profile> {
    const { firstName, lastName } = createProfileDto;

    profile.firstName = firstName;
    profile.lastName = lastName;

    await transactionalEntityManager.save(profile);

    return profile;
  }

  async updateProfileInfo(
    profile: Profile,
    createProfileDto: CreateProfileDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Profile> {
    const { firstName, lastName } = createProfileDto;

    profile.firstName = firstName;
    profile.lastName = lastName;

    await transactionalEntityManager.save(profile);

    return profile;
  }

  async deleteProfile(
    profile: Profile,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    await transactionalEntityManager.softRemove(profile);
  }
}
