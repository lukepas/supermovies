import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { UserTokenModel } from './user-token.model';
import { AuthService } from './auth.service';
import { Connection } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../role/roles.guard';
import { GetUser } from '../user/get-user.decorator';
import { User } from '../user/user.entity';
import { Roles } from '../role/roles.decorator';
import { Role } from '../role/role.enum';
import { RegisterDto } from './dto/register.dto';
import { ConfirmRegistrationDto } from './dto/confirm-registration.dto';
import { LoginAuthDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfirmationCodeValidationDto } from './dto/confirmation-code-validation.dto';
import { RemindPasswordDto } from './dto/password-remind.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private connection: Connection,
  ) {}
  @Post('/login')
  login(
    @Body(ValidationPipe) loginAuthDto: LoginAuthDto,
  ): Promise<UserTokenModel> {
    return this.authService.login(loginAuthDto);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.OWNER)
  async refreshToken(@GetUser() user: User): Promise<UserTokenModel> {
    return this.authService.refreshToken(user);
  }

  @Post('/register')
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<void> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.authService.register(
          registerDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Post('/confirm-registration')
  async confirmRegistration(
    @Body(ValidationPipe) confirmRegistrationDto: ConfirmRegistrationDto,
  ): Promise<UserTokenModel> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.authService.confirmRegistrationAndLogin(
          confirmRegistrationDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Post('/validate-confirmation-code')
  async validateConfirmationCode(
    @Body(ValidationPipe)
    confirmationCodeValidationDto: ConfirmationCodeValidationDto,
  ): Promise<User> {
    return this.authService.validateConfirmationCode(
      confirmationCodeValidationDto,
    );
  }

  @Patch('/reset-password')
  async resetPassword(
    @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto,
  ): Promise<UserTokenModel> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.authService.resetPasswordAndLogin(
          resetPasswordDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }

  @Post('/remind')
  async remind(
    @Body(ValidationPipe) remindPasswordDto: RemindPasswordDto,
  ): Promise<void> {
    return await this.connection.transaction((transactionalEntityManager) => {
      try {
        return this.authService.remindPassword(
          remindPasswordDto,
          transactionalEntityManager,
        );
      } catch (e) {}
    });
  }
}
