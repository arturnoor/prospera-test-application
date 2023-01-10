import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIndustryChangeApplicationRequest } from '../dto/create-industry-change-application-request.dto';
import { SearchIndustryChangeApplicationsDTO } from '../dto/search-industry-change-applications.dto';
import { DecisionEntity } from '../entities/decision.entity';
import { IndustryChangeApplicationEntity } from '../entities/industry-change-applications.entity';
import { IndustryInformationEntity } from '../entities/industry-information.entity';
import { ResidentEntity } from '../entities/resident.entity';
import ApplicationStatus from '../enum/application-status.enum';
import ObjectStatus from '../enum/object-status.enum';
import RegistrationType from '../enum/registration-type.enum';
import ResidentObjectStatus from '../enum/resident-object-status.enum';
import { IIndustryChangeApplication } from '../interfaces/industry-change-application.interface';
import { IResident } from '../interfaces/resident.interface';
import { In, Repository } from 'typeorm';
import { AddressEntity } from '../entities/address.entity';

@Injectable()
export class ResidentRegisterService {
  constructor(
    @InjectRepository(IndustryChangeApplicationEntity)
    private industryChangeApplicationRepository: Repository<IndustryChangeApplicationEntity>,
    @InjectRepository(AddressEntity)
    private addressesRepository: Repository<AddressEntity>,
    @InjectRepository(IndustryInformationEntity)
    private industryInformationsRepository: Repository<IndustryInformationEntity>,
    @InjectRepository(DecisionEntity)
    private decisionsRepository: Repository<DecisionEntity>,
    @InjectRepository(ResidentEntity)
    private residentsRepository: Repository<ResidentEntity>,
  ) {}

  async createIndustryChangeApplication(
    request: CreateIndustryChangeApplicationRequest,
  ): Promise<IIndustryChangeApplication> {
    this.validateOptionalFields(request);

    const typesOfRegistration = [
      RegistrationType.E_RESIDENCY,
      RegistrationType.RESIDENCY,
    ];
    const resident = await this.residentsRepository.findOne({
      where: {
        status: ResidentObjectStatus.ACTIVE,
        sub: request.residentSub,
        typeOfRegistration: In(typesOfRegistration),
      },
      relations: ['address'],
    });
    if (!resident) {
      const msg =
        'There is no user active e-residency or active physical residency with the given residentSub';
      throw new BadRequestException(msg);
    }
    if (this.isSameIndustryInformation(request, resident)) {
      throw new BadRequestException('The industry informations are same');
    }

    const ica = await this.createApplicationEntity(request, resident);
    if (ica.status === ApplicationStatus.APPROVED) {
      const update = {
        ...resident,
        willWorkInPhysicalJurisdiction:
          ica.requested.willWorkInPhysicalJurisdiction,
        industry: ica.requested.industry,
        regulatoryElection: ica.requested.regulatoryElection,
        regulatoryElectionSub: ica.requested.regulatoryElectionSub,
      };
      await this.residentsRepository.save(update);
    }
    return ica;
  }

  async createApplicationEntity(
    request: CreateIndustryChangeApplicationRequest,
    resident: IResident,
  ) {
    const applicationStatus = this.calculateApplicationStatus(request);

    const payload = {
      residentSub: request.residentSub,
      current: {
        willWorkInPhysicalJurisdiction: resident.willWorkInPhysicalJurisdiction,
        industry: resident.industry,
        regulatoryElection: resident.regulatoryElection,
        regulatoryElectionSub: resident.regulatoryElectionSub,
      },
      requested: {
        willWorkInPhysicalJurisdiction: request.willWorkInPhysicalJurisdiction,
        industry: request.industry,
        regulatoryElection: request.regulatoryElection,
        regulatoryElectionSub: request.regulatoryElectionSub,
      },
      status: applicationStatus,
      submittedAt: new Date(),
      decision: {
        decidedAt:
          applicationStatus === ApplicationStatus.IN_REVIEW ? null : new Date(),
        decidedBy:
          applicationStatus === ApplicationStatus.IN_REVIEW
            ? null
            : 'Automatic',
        rejectionReason: null,
      },
      createdBy: null, // There is no user in requirements
      updatedBy: null, // There is no user in requirements
      objectStatus: ObjectStatus.CURRENT,
    };
    const industryChangeApplication =
      await this.industryChangeApplicationRepository.save(payload);
    return this.getIndustryChangeApplicationById(industryChangeApplication.id);
  }

  getIndustryChangeApplicationById(
    id: number,
  ): Promise<IIndustryChangeApplication> {
    const exists = this.industryChangeApplicationRepository.findOne({
      where: { id, objectStatus: ObjectStatus.CURRENT },
      relations: ['current', 'requested', 'decision'],
    });
    if (!exists) throw new NotFoundException();
    return exists;
  }

  calculateApplicationStatus(
    request: CreateIndustryChangeApplicationRequest,
  ): ApplicationStatus {
    return request.willWorkInPhysicalJurisdiction
      ? ApplicationStatus.IN_REVIEW
      : ApplicationStatus.APPROVED;
  }

  isSameIndustryInformation(
    request: CreateIndustryChangeApplicationRequest,
    resident: IResident,
  ) {
    return (
      request.willWorkInPhysicalJurisdiction ===
        resident.willWorkInPhysicalJurisdiction &&
      request.industry === resident.industry &&
      request.regulatoryElection === resident.regulatoryElection
    );
  }

  validateOptionalFields(payload: CreateIndustryChangeApplicationRequest) {
    if (payload.willWorkInPhysicalJurisdiction) {
      if (!payload.regulatoryElection) {
        throw new BadRequestException(
          'Provide regulatoryElection, when willWorkInPhysicalJurisdiction=true',
        );
      }
      if (!payload.industry) {
        throw new BadRequestException(
          'Provide industry, when willWorkInPhysicalJurisdiction=true',
        );
      }
      if (!payload.regulatoryElectionSub) {
        throw new BadRequestException(
          'Provide regulatoryElectionSub, when willWorkInPhysicalJurisdiction=true',
        );
      }
    }
  }

  async searchIndustryChangeApplications(
    query: SearchIndustryChangeApplicationsDTO,
  ): Promise<IIndustryChangeApplication[]> {
    const { residentSub, statuses } = query;

    const relations = ['current', 'requested', 'decision'];
    const where = {
      residentSub,
      ...(statuses?.length && { status: In(statuses) }),
      objectStatus: ObjectStatus.CURRENT,
    };

    return this.industryChangeApplicationRepository.find({ where, relations });
  }

  async deleteIndustryChangeApplicationById(id: number) {
    const exists = await this.industryChangeApplicationRepository.findOneBy({
      id,
      status: ApplicationStatus.IN_REVIEW,
      objectStatus: ObjectStatus.CURRENT,
    });
    if (!exists) throw new NotFoundException();
    await this.industryChangeApplicationRepository.save({
      ...exists,
      objectStatus: ObjectStatus.DELETED,
    });
  }
}
