export class SendEmailDto {
  to: string;
  subject: string;
  template: string;
  locale?: string;
  context: Record<string, string>;
}
