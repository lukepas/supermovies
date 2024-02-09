import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '../profile/profile.repository';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { HashService } from './auth.utils';
import * as config from 'config';

type JwtConfig = {
  secret: string;
  expiresIn: string;
};

const jwtConfig = config.get('jwt') as JwtConfig;

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      ProfileRepository,
    ]),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    AuthService,
    ProfileService,
    UserService,
    EmailService,
    HashService,
  ],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
