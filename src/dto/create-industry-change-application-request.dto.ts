import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import Industry from '../enum/Industry.enum';
import RegulatoryElection from '../enum/regulatory-election.enum';

const enumErrorMessage = (enumType: any, fieldName: string): string => {
  return `Allowed values for '${fieldName}' are [${Object.values(enumType).join(
    ', ',
  )}]`;
};

export class CreateIndustryChangeApplicationRequest {
  @ApiProperty({ description: 'Resident id.', default: 1 })
  @IsInt()
  @IsPositive()
  residentSub: number;

  @ApiProperty({
    description: 'Describes if resident will  work in physical  jurisdiction.',
  })
  @IsBoolean()
  willWorkInPhysicalJurisdiction: boolean;

  @ApiProperty({
    description: 'Regulated industry  information.',
    enum: Object.values(Industry),
    required: false,
  })
  @IsEnum(Industry, { message: enumErrorMessage(Industry, 'industry') })
  @IsOptional()
  industry?: Industry | null;

  @ApiProperty({
    description: 'Regulatory election.',
    enum: Object.values(RegulatoryElection),
    required: false,
  })
  @IsEnum(RegulatoryElection, {
    message: enumErrorMessage(Industry, 'regulatoryElection'),
  })
  @IsOptional()
  regulatoryElection?: RegulatoryElection | null;

  @ApiProperty({ description: 'Sub-regulatory election.', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  regulatoryElectionSub?: string | null;
}
