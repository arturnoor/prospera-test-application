import Industry from 'src/enum/Industry.enum';
import RegistrationSubType from 'src/enum/registration-sub-type.enum';
import RegistrationType from 'src/enum/registration-type.enum';
import RegulatoryElection from 'src/enum/regulatory-election.enum';
import ResidentObjectStatus from 'src/enum/resident-object-status.enum';

export interface IAddress {
  id: number;
  country: string;
  city: string;
  state?: string;
  streetAddress: string;
  zipCode: string;
  isVerifiedAddress: boolean;
  residentSub: number;
}

export interface IResident {
  sub: number;
  firstName: string;
  lastName: string;
  fullName: string;
  permitNumber: number;
  permitNumberQRCode?: string; // base64
  dateOfBirth: Date;
  countryOfBirth: string;
  email: string;
  citizenship: string;
  gender: string;
  address: IAddress;
  phoneNumber: string;
  typeOfRegistration: RegistrationType;
  typeOfRegistrationSub: RegistrationSubType;
  industry: Industry;
  willWorkInPhysicalJurisdiction: boolean;
  regulatoryElection: RegulatoryElection | null;
  regulatoryElectionSub?: string;
  firstRegistrationDate: Date;
  nextSubscriptionPaymentDate: Date;
  profilePicture: string; // Base64
  status: ResidentObjectStatus;
  residencyEndDate?: Date;
}
