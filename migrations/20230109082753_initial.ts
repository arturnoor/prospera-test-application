import { Knex } from 'knex';
import ApplicationStatus from '../src/enum/application-status.enum';
import Industry from '../src/enum/Industry.enum';
import ObjectStatus from '../src/enum/object-status.enum';
import RegistrationSubType from '../src/enum/registration-sub-type.enum';
import RegistrationType from '../src/enum/registration-type.enum';
import RegulatoryElection from '../src/enum/regulatory-election.enum';
import ResidentObjectStatus from '../src/enum/resident-object-status.enum';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('residents', (table) => {
      table.increments('sub');
      table.string('firstName').notNullable();
      table.string('lastName').notNullable();
      table.string('fullName').notNullable();
      table.integer('permitNumber').notNullable();
      table.string('permitNumberQRCode');
      table.timestamp('dateOfBirth').notNullable();
      table.string('countryOfBirth').notNullable();
      table.string('email').notNullable();
      table.string('citizenship').notNullable();
      table.string('gender').notNullable();
      table.string('phoneNumber').notNullable();
      table
        .enum('typeOfRegistration', Object.values(RegistrationType))
        .notNullable();
      table
        .enum('typeOfRegistrationSub', Object.values(RegistrationSubType))
        .notNullable();
      table.enum('industry', Object.values(Industry)).notNullable();
      table.boolean('willWorkInPhysicalJurisdiction').notNullable();
      table.enum('regulatoryElection', Object.values(RegulatoryElection));
      table.string('regulatoryElectionSub');
      table.timestamp('firstRegistrationDate').notNullable();
      table.timestamp('nextSubscriptionPaymentDate').notNullable();
      table.string('profilePicture').notNullable();
      table.enum('status', Object.values(ResidentObjectStatus)).notNullable();
      table.timestamp('residencyEndDate');
    })
    .createTable('addresses', (table) => {
      table.increments();
      table.string('country').notNullable();
      table.string('city').notNullable();
      table.string('state');
      table.string('streetAddress').notNullable();
      table.string('zipCode').notNullable();
      table.boolean('isVerifiedAddress').notNullable();
      table
        .integer('residentSub')
        .references('sub')
        .inTable('residents')
        .notNullable()
        .onDelete('CASCADE');
    })
    .createTable('decisions', (table) => {
      table.increments();
      table.timestamp('decidedAt');
      table.string('decidedBy');
      table.string('rejectionReason');
    })
    .createTable('industry_informations', (table) => {
      table.increments();
      table.boolean('willWorkInPhysicalJurisdiction').notNullable();
      table.enum('industry', Object.values(Industry));
      table.enum('regulatoryElection', Object.values(RegulatoryElection));
      table.string('regulatoryElectionSub');
    })
    .createTable('industry_change_applications', (table) => {
      table.increments();
      table
        .integer('residentSub')
        .references('sub')
        .inTable('residents')
        .notNullable();
      table
        .integer('currentId')
        .references('id')
        .inTable('industry_informations')
        .notNullable();
      table
        .integer('requestedId')
        .references('id')
        .inTable('industry_informations')
        .notNullable();
      table.enum('status', Object.values(ApplicationStatus)).notNullable();
      table.timestamp('submittedAt');
      table.integer('decisionId').references('id').inTable('decisions');
      table.enum('objectStatus', Object.values(ObjectStatus)).notNullable();
      table.string('createdBy');
      table.string('updatedBy');

      table.timestamps(true, true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTable('industry_change_applications')
    .dropTable('industry_informations')
    .dropTable('decisions')
    .dropTable('addresses')
    .dropTable('residents');
}
