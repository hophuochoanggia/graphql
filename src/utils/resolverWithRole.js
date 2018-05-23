const acl = {
  user: ['SUPERADMIN', 'ADMIN'],
  users: ['SUPERADMIN', 'ADMIN'],
  createUser: ['SUPERADMIN', 'ADMIN'],
  editUserById: ['LEVEL', 'SUPERADMIN', 'ADMIN'],
  changePwd: ['LEVEL'],

  patient: ['SUPERADMIN', 'ADMIN'],
  patients: ['SUPERADMIN', 'ADMIN'],
  createPatient: ['SUPERADMIN', 'ADMIN', 'CONSULTANT'],
  editPatientById: ['SUPERADMIN', 'ADMIN', 'CONSULTANT'],

  eventType: ['SUPERADMIN', 'ADMIN', 'CONSULTANT'],
  eventTypes: ['SUPERADMIN', 'ADMIN', 'CONSULTANT'],

  createEventType: ['SUPERADMIN'],
  editEventTypeById: ['SUPERADMIN'],

  event: ['SUPERADMIN', 'ADMIN'],
  events: ['SUPERADMIN', 'ADMIN'],
  createEvent: ['SUPERADMIN', 'ADMIN', 'CONSULTANT'],
  editEventById: ['SUPERADMIN', 'ADMIN', 'CONSULTANT'],

  config: ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'DENTIST', 'SCIENTIST'],
  configs: ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'DENTIST', 'SCIENTIST'],
  createConfig: ['SUPERADMIN'],
  editConfigByName: ['SUPERADMIN'],

  referrals: ['SUPERADMIN', 'ADMIN'],
  referral: ['SUPERADMIN', 'ADMIN'],
  createReferral: ['DOCTOR'],
  editReferralById: ['SUPERADMIN', 'ADMIN', 'OWNER'],
  deleteReferralById: ['SUPERADMIN', 'ADMIN', 'OWNER']
};

const level = {
  SUPERADMIN: 3,
  ADMIN: 2,
  CONSULTANT: 1,
  DOCTOR: 1,
  SPECIALIST: 1,
  DENTIST: 1
};
export const roles = ['SUPERADMIN', 'ADMIN', 'CONSULTANT', 'DOCTOR', 'SPECIALIST', 'DENTIST'];
export const roleResolver = (methodName, role) => acl[methodName].indexOf(role) > -1;
export const resolverWithRole = (methodName, role, { actorId, model, instance }, resolver) => {
  const rule = acl[methodName];

  if (!rule) return Promise.reject(new Error('Unauthorized')); // deny if can't find rule

  if (rule.indexOf('OWNER') > -1) {
    if (model === 'user' && actorId === instance.id) {
      return resolver();
    }
    if (model === 'referral' && actorId === instance.doctorId) {
      return resolver();
    }
  }
  // For user model only (user with higher level can edit lower level)
  if (rule.indexOf('LEVEL') > -1) {
    if (level[role] > level[instance.role]) {
      return resolver();
    }
    if (role === 'SUPERADMIN' || (instance.role === 'ADMIN' && role === 'ADMIN')) {
      return resolver();
    }
  }
  if (rule.indexOf(role) > -1) {
    return resolver();
  }
  return Promise.reject(new Error('Unauthorized'));
};
