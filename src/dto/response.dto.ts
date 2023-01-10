import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import ApplicationStatus from '../enum/application-status.enum';
import Industry from '../enum/Industry.enum';
import ObjectStatus from '../enum/object-status.enum';
import RegulatoryElection from '../enum/regulatory-election.enum';
import {
  IDecision,
  IIndustryChangeApplication,
  IIndustryInformation,
} from '../interfaces/industry-change-application.interface';

class IndustryInformationDTO {
  @ApiProperty()
  willWorkInPhysicalJurisdiction: boolean;

  @ApiProperty({ nullable: true })
  industry?: Industry;

  @ApiProperty({ nullable: true })
  regulatoryElection?: RegulatoryElection;

  @ApiProperty({ nullable: true })
  regulatoryElectionSub?: string;

  constructor(industryInfo: IIndustryInformation) {
    this.willWorkInPhysicalJurisdiction =
      industryInfo.willWorkInPhysicalJurisdiction;
    this.industry = industryInfo.industry;
    this.regulatoryElection = industryInfo.regulatoryElection;
    this.regulatoryElectionSub = industryInfo.regulatoryElectionSub;
  }
}

class DecisionDTO {
  @ApiProperty({ nullable: true, isArray: false })
  decidedAt?: Date;

  @ApiProperty({ nullable: true })
  rejectionReason?: string;

  constructor(decision: IDecision) {
    this.decidedAt = decision.decidedAt;
    this.rejectionReason = decision.rejectionReason;
  }
}

export class IndustryChangeApplicationDetailsDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  residentSub: number;

  @ApiProperty({ type: IndustryInformationDTO })
  @Type(() => IndustryInformationDTO)
  current: IndustryInformationDTO;

  @ApiProperty({ type: IndustryInformationDTO })
  @Type(() => IndustryInformationDTO)
  requested: IndustryInformationDTO;

  @ApiProperty({})
  status: ApplicationStatus;

  @ApiProperty({ nullable: true })
  submittedAt?: Date;

  @ApiProperty({ type: DecisionDTO, nullable: true })
  @Type(() => DecisionDTO)
  decision?: DecisionDTO;

  @ApiProperty({})
  objectStatus: ObjectStatus;

  constructor(ica: IIndustryChangeApplication) {
    this.id = ica.id;
    this.residentSub = ica.residentSub;
    this.current = new IndustryInformationDTO(ica.current);
    this.requested = new IndustryInformationDTO(ica.requested);
    this.status = ica.status;
    this.submittedAt = ica.submittedAt;
    this.decision = ica.decision ? new DecisionDTO(ica.decision) : null;
    this.objectStatus = ica.objectStatus;
  }
}
