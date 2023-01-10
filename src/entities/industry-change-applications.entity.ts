import ApplicationStatus from '../enum/application-status.enum';
import ObjectStatus from '../enum/object-status.enum';
import { IIndustryChangeApplication } from '../interfaces/industry-change-application.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecisionEntity } from './decision.entity';
import { IndustryInformationEntity } from './industry-information.entity';

@Entity('industry_change_applications')
export class IndustryChangeApplicationEntity
  implements IIndustryChangeApplication
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  residentSub: number;

  @Column('varchar')
  status: ApplicationStatus;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy?: string;

  @Column('varchar')
  objectStatus: ObjectStatus;

  // Relations
  @OneToOne(() => DecisionEntity)
  @JoinColumn({ name: 'decisionId' })
  decision?: DecisionEntity;

  @OneToOne(() => IndustryInformationEntity, { cascade: ['insert'] })
  @JoinColumn({ name: 'currentId' })
  current: IndustryInformationEntity;

  @OneToOne(() => IndustryInformationEntity, { cascade: ['insert'] })
  @JoinColumn({ name: 'requestedId' })
  requested: IndustryInformationEntity;
}
