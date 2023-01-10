import { IDecision } from '../interfaces/industry-change-application.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('decisions')
export class DecisionEntity implements IDecision {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  decidedAt?: Date;

  @Column({ type: 'varchar', nullable: true })
  decidedBy?: string;

  @Column({ type: 'varchar', nullable: true })
  rejectionReason?: string;
}
