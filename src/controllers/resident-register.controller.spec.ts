import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { ResidentRegisterController } from './resident-register.controller';
import { ResidentRegisterService } from '../services/resident-register.service';
import { IIndustryChangeApplication } from '../interfaces/industry-change-application.interface';
import Industry from '../enum/Industry.enum';
import RegulatoryElection from '../enum/regulatory-election.enum';
import RegistrationSubType from '../enum/registration-sub-type.enum';
import ObjectStatus from '../enum/object-status.enum';
import ApplicationStatus from '../enum/application-status.enum';
import { SearchIndustryChangeApplicationsDTO } from '../dto/search-industry-change-applications.dto';
import { request } from 'http';
import { CreateIndustryChangeApplicationRequest } from '../dto/create-industry-change-application-request.dto';
import { IndustryChangeApplicationDetailsDTO } from '../dto/response.dto';

const industryChangeApplications: IIndustryChangeApplication[] = [
  {
    id: 1,
    current: {
      id: 1,
      willWorkInPhysicalJurisdiction: true,
      industry: Industry.AGRICULTURAL,
      regulatoryElection: RegulatoryElection.AUSTRALIA,
      regulatoryElectionSub: RegistrationSubType.HONDURAN,
    },
    requested: {
      id: 1,
      willWorkInPhysicalJurisdiction: true,
      industry: Industry.AGRICULTURAL,
      regulatoryElection: RegulatoryElection.AUSTRALIA,
      regulatoryElectionSub: RegistrationSubType.HONDURAN,
    },
    objectStatus: ObjectStatus.CURRENT,
    residentSub: 1,
    status: ApplicationStatus.IN_REVIEW,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: 2,
    current: {
      id: 1,
      willWorkInPhysicalJurisdiction: true,
      industry: Industry.AGRICULTURAL,
      regulatoryElection: RegulatoryElection.AUSTRALIA,
      regulatoryElectionSub: RegistrationSubType.HONDURAN,
    },
    requested: {
      id: 1,
      willWorkInPhysicalJurisdiction: true,
      industry: Industry.AGRICULTURAL,
      regulatoryElection: RegulatoryElection.AUSTRALIA,
      regulatoryElectionSub: RegistrationSubType.HONDURAN,
    },
    objectStatus: ObjectStatus.CURRENT,
    residentSub: 1,
    status: ApplicationStatus.IN_REVIEW,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];

describe('ResidentRegisterController', () => {
  let controller: ResidentRegisterController;

  const mockResidentRegisterService = {
    createIndustryChangeApplication: jest.fn(
      async (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request: CreateIndustryChangeApplicationRequest,
      ): Promise<IndustryChangeApplicationDetailsDTO> => {
        return new IndustryChangeApplicationDetailsDTO(
          industryChangeApplications[0],
        );
      },
    ),

    getIndustryChangeApplicationById: jest.fn((id: number) => {
      const industryChangeApplication = industryChangeApplications.find((c) => {
        return c.id === id;
      });
      if (!industryChangeApplication) throw new NotFoundException();
      return industryChangeApplication;
    }),

    deleteIndustryChangeApplicationById: jest.fn((id: number) => {
      const industryChangeApplication = industryChangeApplications.find(
        (a) => a.id === id,
      );
      if (!industryChangeApplication) throw new NotFoundException();
      industryChangeApplication.objectStatus = ObjectStatus.DELETED;
    }),

    searchIndustryChangeApplications: jest.fn(
      ({ residentSub, statuses }: SearchIndustryChangeApplicationsDTO) => {
        return industryChangeApplications.filter((ica) => {
          return (
            ica.residentSub === residentSub &&
            statuses.includes(ica.status) &&
            ica.objectStatus === ObjectStatus.CURRENT
          );
        });
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResidentRegisterController],
      providers: [ResidentRegisterService],
    })
      .overrideProvider(ResidentRegisterService)
      .useValue(mockResidentRegisterService)
      .compile();

    controller = module.get<ResidentRegisterController>(
      ResidentRegisterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return industry change application', async () => {
    expect(
      await controller.getIndustryChangeApplicationById({ id: 1 }),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        current: expect.objectContaining({
          willWorkInPhysicalJurisdiction: expect.any(Boolean),
          industry: expect.any(String),
          regulatoryElection: expect.any(String),
          regulatoryElectionSub: expect.any(String),
        }),
        requested: expect.objectContaining({
          willWorkInPhysicalJurisdiction: expect.any(Boolean),
          industry: expect.any(String),
          regulatoryElection: expect.any(String),
          regulatoryElectionSub: expect.any(String),
        }),
        objectStatus: expect.any(String),
        residentSub: 1,
        status: expect.any(String),
      }),
    );
  });

  it('should list industry change applications', async () => {
    expect(
      await controller.searchIndustryChangeApplications({
        residentSub: 1,
        statuses: [ApplicationStatus.IN_REVIEW],
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          current: expect.objectContaining({
            willWorkInPhysicalJurisdiction: expect.any(Boolean),
            industry: expect.any(String),
            regulatoryElection: expect.any(String),
            regulatoryElectionSub: expect.any(String),
          }),
          requested: expect.objectContaining({
            willWorkInPhysicalJurisdiction: expect.any(Boolean),
            industry: expect.any(String),
            regulatoryElection: expect.any(String),
            regulatoryElectionSub: expect.any(String),
          }),
          objectStatus: expect.any(String),
          residentSub: 1,
          status: expect.any(String),
        }),
      ]),
    );
  });

  it('should create industry change application', async () => {
    expect(
      await controller.createIndustryChangeApplication({
        residentSub: 1,
        willWorkInPhysicalJurisdiction: false,
        industry: Industry.FINANCE_AND_INSURANCE,
        regulatoryElection: RegulatoryElection.AUSTRALIA,
        regulatoryElectionSub: RegistrationSubType.HONDURAN,
      }),
    ).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        current: expect.objectContaining({
          willWorkInPhysicalJurisdiction: expect.any(Boolean),
          industry: expect.any(String),
          regulatoryElection: expect.any(String),
          regulatoryElectionSub: expect.any(String),
        }),
        requested: expect.objectContaining({
          willWorkInPhysicalJurisdiction: expect.any(Boolean),
          industry: expect.any(String),
          regulatoryElection: expect.any(String),
          regulatoryElectionSub: expect.any(String),
        }),
        objectStatus: expect.any(String),
        residentSub: 1,
        status: expect.any(String),
      }),
    );
  });

  it('should delete industry change application', async () => {
    expect(await controller.deleteIndustryChangeApplication({ id: 2 })).toEqual(
      expect.objectContaining({
        success: true,
      }),
    );
  });
});
