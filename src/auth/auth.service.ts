import {
  ConflictException,
  ForbiddenException,
  HttpService,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './jwt-payload.interface';
import { EntityManager } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../user/user.repository';
import { UserTokenModel } from './user-token.model';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import * as config from 'config';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../email/email.service';
import { LoginAuthDto } from './dto/login.dto';
import { Role } from '../role/role.enum';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmationCodeValidationDto } from './dto/confirmation-code-validation.dto';
import { RemindPasswordDto } from './dto/password-remind.dto';
import { ProfileRepository } from '../profile/profile.repository';
import { HashService } from './auth.utils';

const settings = config.get('settings');

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(ProfileRepository)
    private profileRepository: ProfileRepository,

    private emailService: EmailService,

    private jwtService: JwtService,

    private userService: UserService,

    private hashService: HashService,
  ) {}
  async login(loginAuthDto: LoginAuthDto): Promise<UserTokenModel> {
    const user = await this.userRepository.getUserByEmail(
      loginAuthDto.email,
      true,
    );

    if (!user || !user.password) {
      throw new ForbiddenException('VALIDATION.INVALID_CREDENTIALS');
    }

    if (user.registrationToken) {
      throw new ForbiddenException('VALIDATION.NOT_CONFIRMED');
    }

    if (user && !(await user.validatePassword(loginAuthDto.password))) {
      throw new ForbiddenException('VALIDATION.INVALID_CREDENTIALS');
    }

    return this.generateJwtToken(user);
  }

  async refreshToken(user: User): Promise<UserTokenModel> {
    return this.generateJwtToken(user);
  }

  async register(
    registerDto: RegisterDto,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: registerDto.email,
      },
      loadEagerRelations: false,
    });

    if (foundUser) {
      throw new ConflictException('VALIDATION.USER_ALREADY_EXISTS');
    }

    const user = await this.userService.createUser(
      {
        role: Role.OWNER,
        email: registerDto.email,
        lastName: registerDto.lastName,
        firstName: registerDto.firstName,
      },
      transactionalEntityManager,
    );

    user.salt = await this.hashService.generateSalt();
    user.password = await this.hashService.hashPassword(
      registerDto.password,
      user.salt,
    );
    user.registrationToken = uuidv4();

    await transactionalEntityManager.save(user);

    await this.emailService.sendEmail({
      template: 'registration-confirmation',
      to: registerDto.email,
      subject: 'REGISTRATION_CONFIRMATION_EMAIL.SUBJECT',
      context: {
        registrationCodeLink: `${
          process.env.ASSETS_PATH || settings.path
        }registration-confirmation/${user.registrationToken}`,
        buttonMessage: 'REGISTRATION_CONFIRMATION_EMAIL.BUTTON_MESSAGE',
        infoMessage: 'REGISTRATION_CONFIRMATION_EMAIL.INFO_MESSAGE',
        sentByMessage: 'REGISTRATION_CONFIRMATION_EMAIL.SENT_BY_MESSAGE',
      },
    });
  }

  async confirmRegistrationAndLogin(
    confirmRegistrationDto: ConfirmRegistrationDto,
    transactionalEntityManager: EntityManager,
  ): Promise<UserTokenModel> {
    const user = await this.userRepository.getUserByRegistrationCode(
      confirmRegistrationDto.code,
    );

    if (!user) {
      throw new ConflictException('VALIDATION.USER_NOT_FOUND');
    }

    user.registrationToken = null;
    await transactionalEntityManager.save(user);


    return this.generateJwtToken(user);
  }

  async resetPasswordAndLogin(
    resetPasswordDto: ResetPasswordDto,
    transactionalEntityManager: EntityManager,
  ): Promise<UserTokenModel> {
    const user = await this.userRepository.getUserByEmailAndConfirmationToken(
      resetPasswordDto.email,
      resetPasswordDto.code,
    );

    if (!user) {
      throw new ConflictException('VALIDATION.INVALID_PASSWORD_CODE');
    }

    user.salt = await this.hashService.generateSalt();
    user.password = await this.hashService.hashPassword(
      resetPasswordDto.password,
      user.salt,
    );
    user.confirmationToken = null;
    user.registrationToken = null;

    await transactionalEntityManager.save(user);

    return this.generateJwtToken(user);
  }

  async remindPassword(
    remindPasswordDto: RemindPasswordDto,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    const foundUser = await this.userRepository.getUserByEmail(
      remindPasswordDto.email,
    );

    if (!foundUser) {
      throw new ConflictException('VALIDATION.USER_NOT_FOUND');
    }

    foundUser.confirmationToken = uuidv4();
    await transactionalEntityManager.save(foundUser);

    await this.emailService.sendEmail({
      template: 'password-remind',
      to: remindPasswordDto.email,
      subject: 'PASSWORD_REMIND_EMAIL.SUBJECT',
      context: {
        confirmationCodeLink: `${
          process.env.ASSETS_PATH || settings.path
        }password-reset/${foundUser.confirmationToken}`,
        buttonMessage: 'PASSWORD_REMIND_EMAIL.BUTTON_MESSAGE',
        infoMessage: 'PASSWORD_REMIND_EMAIL.INFO_MESSAGE',
        helloMessage: 'PASSWORD_REMIND_EMAIL.HELLO_MESSAGE',
        sentByMessage: 'PASSWORD_REMIND_EMAIL.SENT_BY_MESSAGE',
      },
    });
  }

  async validateConfirmationCode(
    confirmationCodeValidationDto: ConfirmationCodeValidationDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        confirmationToken: confirmationCodeValidationDto.code,
      },
      loadEagerRelations: false,
    });

    if (!user) {
      throw new ConflictException('VALIDATION.INVALID_PASSWORD_CODE');
    }

    return user;
  }

  private async generateJwtToken(user: User): Promise<UserTokenModel> {
    const payload: JwtPayload = { email: user.email };
    const token = this.jwtService.sign(payload);

    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return new UserTokenModel(token, user.role);
  }
}
