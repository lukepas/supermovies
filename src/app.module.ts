import { HttpException, Module } from '@nestjs/common';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RavenInterceptor } from 'nest-raven';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as path from 'path';
import { EmailModule } from './email/email.module';
import { MovieModule } from './movie/movie.module';
import { MovieCategoryModule } from './movie-category/movie-category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    RoleModule,
    UserModule,
    AuthModule,
    ProfileModule,
    EmailModule,
    MovieModule,
    MovieCategoryModule,
    MailerModule.forRoot({
      transport: `smtp://${process.env.SMTP_USERNAME}:${process.env.SMTP_PASSWORD}@${process.env.SMTP_URL}`,
      defaults: {
        from: 'system@supermovies.com',
      },
      template: {
        dir: path.join(__dirname, '/templates/'),
        adapter: new EjsAdapter({
          inlineCssEnabled: true,
        }),
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [
          {
            type: HttpException,
            filter: (exception: HttpException) => 500 > exception.getStatus(),
          },
        ],
      }),
    },
  ],
})
export class AppModule {}
