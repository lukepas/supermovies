import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuditService } from '../audit/audit.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '../profile/profile.repository';
import { HashService } from 'src/auth/auth.utils';
import { AssetService } from '../asset/asset.service';
import { DoSpacesServiceProvider } from '../asset/asset.utils';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, ProfileRepository]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [AuditService, UserService, ProfileService, HashService, AssetService, DoSpacesServiceProvider],
  exports: [],
})
export class UserModule {}
