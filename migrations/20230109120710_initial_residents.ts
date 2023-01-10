import { Knex } from 'knex';
import RegistrationSubType from '../src/enum/registration-sub-type.enum';
import RegistrationType from '../src/enum/registration-type.enum';
import RegulatoryElection from '../src/enum/regulatory-election.enum';
import ResidentObjectStatus from '../src/enum/resident-object-status.enum';
import Industry from '../src/enum/Industry.enum';

export async function up(knex: Knex): Promise<void> {
  const residentPayload = {
    citizenship: 'Armenian',
    countryOfBirth: 'Armenia',
    dateOfBirth: new Date(),
    email: 'john@gmail.com',
    firstName: 'John',
    lastName: 'Smith',
    firstRegistrationDate: new Date(),
    fullName: 'John Smith',
    gender: 'Male',
    industry: Industry.AGRICULTURAL,
    phoneNumber: '+37499112233',
    typeOfRegistration: RegistrationType.E_RESIDENCY,
    typeOfRegistrationSub: RegistrationSubType.HONDURAN,
    willWorkInPhysicalJurisdiction: true,
    regulatoryElection: RegulatoryElection.USA,
    regulatoryElectionSub: null,
    nextSubscriptionPaymentDate: new Date(),
    profilePicture: 'image',
    status: ResidentObjectStatus.ACTIVE,
    residencyEndDate: new Date(),
    permitNumber: 3273,
    permitNumberQRCode: '123567',
  };

  const resident = await knex('residents')
    .insert(residentPayload)
    .returning('*');

  const addressPayload = {
    city: 'Yerevan',
    country: 'Armenia',
    isVerifiedAddress: true,
    streetAddress: 'Andranik Street',
    zipCode: '123456',
    state: null,
    residentSub: resident[0].sub,
  };
  await knex('addresses').insert(addressPayload);
}

export async function down(knex: Knex): Promise<void> {
  await knex('residents').del();
}
