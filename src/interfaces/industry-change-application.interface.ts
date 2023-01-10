import ApplicationStatus from 'src/enum/application-status.enum';
import Industry from 'src/enum/Industry.enum';
import RegulatoryElection from 'src/enum/regulatory-election.enum';
import ObjectStatus from 'src/enum/object-status.enum';

export interface IIndustryInformation {
  id: number;
  willWorkInPhysicalJurisdiction: boolean;
  industry?: Industry;
  regulatoryElection?: RegulatoryElection;
  regulatoryElectionSub?: string;
}

export interface IDecision {
  id: number;
  decidedAt?: Date;
  decidedBy?: string;
  rejectionReason?: string;
}

export interface IIndustryChangeApplication {
  id: number;
  residentSub: number;
  current: IIndustryInformation;
  requested: IIndustryInformation;
  status: ApplicationStatus;
  submittedAt?: Date;
  decision?: IDecision;
  createdAt: Date;
  createdBy?: string;
  updatedAt: Date;
  updatedBy?: string;
  objectStatus: ObjectStatus;
}
