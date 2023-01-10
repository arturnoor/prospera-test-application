import { ApiProperty } from '@nestjs/swagger';

export class SuccessDTO {
  @ApiProperty({ default: true })
  success: boolean;
}
