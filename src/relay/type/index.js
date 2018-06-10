/* global module */
import userType from './user';
import patientType from './patient';
import reasonType from './reason';
import eventType from './event';
// import eventTypeType from "./eventType";
import configType from './config';
import referralType from './referral';

const type = {
  userType,
  patientType,
  reasonType,
  eventType,
  configType,
  referralType
};
module.exports = type;
