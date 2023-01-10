import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import ApplicationStatus from '../enum/application-status.enum';

const ToArray = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToArray(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToArray = (value: any) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  const arr = value instanceof Array ? value : [value];
  return arr.filter((d) => d);
};

export class SearchIndustryChangeApplicationsDTO {
  @ApiProperty({ default: 1 })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  residentSub: number;

  @ApiProperty({
    isArray: true,
    required: false,
    enum: Object.values(ApplicationStatus),
  })
  @ToArray()
  @IsArray()
  @IsOptional()
  @IsEnum(ApplicationStatus, { each: true })
  @Type(() => String)
  readonly statuses?: ApplicationStatus[];
}
