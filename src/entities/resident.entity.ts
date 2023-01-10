import Industry from '../enum/Industry.enum';
import RegistrationSubType from '../enum/registration-sub-type.enum';
import RegistrationType from '../enum/registration-type.enum';
import RegulatoryElection from '../enum/regulatory-election.enum';
import ResidentObjectStatus from '../enum/resident-object-status.enum';
import { IResident } from '../interfaces/resident.interface';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity('residents')
export class ResidentEntity implements IResident {
  @PrimaryGeneratedColumn()
  sub: number;

  @Column('varchar')
  firstName: string;

  @Column('varchar')
  lastName: string;

  @Column('varchar')
  fullName: string;

  @Column('int')
  permitNumber: number;

  @Column({ type: 'varchar', nullable: true })
  permitNumberQRCode?: string;

  @Column('timestamp')
  dateOfBirth: Date;

  @Column('varchar')
  countryOfBirth: string;

  @Column('varchar')
  email: string;

  @Column('varchar')
  citizenship: string;

  @Column('varchar')
  gender: string;

  @Column('varchar')
  phoneNumber: string;

  @Column('varchar')
  typeOfRegistration: RegistrationType;

  @Column('varchar')
  typeOfRegistrationSub: RegistrationSubType;

  @Column('varchar')
  industry: Industry;

  @Column('bool')
  willWorkInPhysicalJurisdiction: boolean;

  @Column('varchar')
  regulatoryElection: RegulatoryElection;

  @Column('varchar', { nullable: true })
  regulatoryElectionSub?: string;

  @Column('timestamp')
  firstRegistrationDate: Date;

  @Column('timestamp')
  nextSubscriptionPaymentDate: Date;

  @Column('varchar')
  profilePicture: string;

  @Column('varchar')
  status: ResidentObjectStatus;

  @Column({ type: 'timestamp', nullable: true })
  residencyEndDate?: Date;

  @OneToOne(() => AddressEntity, (address) => address.resident)
  address: AddressEntity;
}
