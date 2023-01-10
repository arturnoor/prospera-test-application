// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config();

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ResidentRegisterController } from './controllers/resident-register.controller';
import { AddressEntity } from './entities/address.entity';
import { DecisionEntity } from './entities/decision.entity';
import { IndustryChangeApplicationEntity } from './entities/industry-change-applications.entity';
import { IndustryInformationEntity } from './entities/industry-information.entity';
import { ResidentEntity } from './entities/resident.entity';
import { ResidentRegisterService } from './services/resident-register.service';

const entities = [
  IndustryInformationEntity,
  IndustryChangeApplicationEntity,
  DecisionEntity,
  AddressEntity,
  ResidentEntity,
];

const connectOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities,
  //logging: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(connectOptions),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [ResidentRegisterController],
  providers: [ResidentRegisterService],
})
export class AppModule {}
