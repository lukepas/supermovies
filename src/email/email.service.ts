import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';
import * as config from 'config';

const settings = config.get('settings');

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendEmail(model: SendEmailDto): Promise<void> {
    const { subject, template, context, to } = model;

    await this.mailerService.sendMail({
      to: to,
      from: {
        name: 'SuperMovies',
        address: 'system@supermovies.com',
      },
      subject: subject,
      template: template,
      context: {
        path: process.env.ASSETS_PATH || settings.path,
        helloMessage: translateOrReturnAlias(
          translationsList,
          'EMAIL.HELLO_MESSAGE',
        ),
        goToMessage: translateOrReturnAlias(
          translationsList,
          'EMAIL.GO_TO_MESSAGE',
        ),
      },
    });
  }
}
