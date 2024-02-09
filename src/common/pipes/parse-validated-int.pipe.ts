import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseValidatedIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    const maxInt = 2147483647;
    if (isNaN(val) || val > maxInt || val < 0) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
