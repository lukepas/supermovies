import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '../profile/profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ProfileRepository]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, ProfileService],
  exports: [],
})
export class UserModule {}
