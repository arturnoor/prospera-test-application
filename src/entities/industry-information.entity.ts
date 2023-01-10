import Industry from '../enum/Industry.enum';
import RegulatoryElection from '../enum/regulatory-election.enum';
import { IIndustryInformation } from '../interfaces/industry-change-application.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('industry_informations')
export class IndustryInformationEntity implements IIndustryInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean')
  willWorkInPhysicalJurisdiction: boolean;

  @Column({ type: 'varchar', nullable: true })
  industry?: Industry;

  @Column({ type: 'varchar', nullable: true })
  regulatoryElection?: RegulatoryElection;

  @Column({ type: 'varchar', nullable: true })
  regulatoryElectionSub?: string;
}
