import { IAddress } from '../interfaces/resident.interface';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResidentEntity } from './resident.entity';

@Entity('addresses')
export class AddressEntity implements IAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  country: string;

  @Column('varchar')
  city: string;

  @Column({ type: 'varchar', nullable: true })
  state?: string;

  @Column('varchar')
  streetAddress: string;

  @Column('varchar')
  zipCode: string;

  @Column('boolean')
  isVerifiedAddress: boolean;

  @Column('integer')
  residentSub: number;

  @OneToOne(() => ResidentEntity)
  @JoinColumn({ name: 'residentSub' })
  resident?: ResidentEntity;
}
