const acl = {
  user: ['owner', 'superadmin', 'admin'],
  users: ['superadmin', 'admin'],
  createUser: ['superadmin', 'admin'],
  editUserById: ['level', 'owner'],

  eventType: ['superadmin', 'admin', 'consultant'],
  eventTypes: ['superadmin', 'admin', 'consultant'],

  createEventType: ['superadmin'],
  editEventTypeById: ['superadmin'],
};

const level = {
  superadmin: 3,
  admin: 2,
  consultant: 1,
  doctor: 1,
  specialist: 1,
  dentist: 1,
};
export const roles = ['superadmin', 'admin', 'consultant', 'doctor', 'specialist', 'dentist'];
export const roleResolver = (methodName, role) => acl[methodName].indexOf(role) > -1;

export const resolverWithRole = (
  methodName,
  role,
  {
    id,
    ownerId, // getting from the context (jwt)
    model, // this to determine rule to determine owner
    instance, // instsance is retrived in resolve function (id === instance.id)
  },
  resolver,
) => {
  const rule = acl[methodName];
  if (rule.indexOf('owner') > -1) {
    if (model === 'user' && ownerId === id) {
      return resolver();
    }
  }

  if (rule.indexOf('level') > -1) {
    if (level[role] > level[instance.role]) {
      return resolver();
    }
    if (role === 'superadmin' || (instance.role === 'admin' && role === 'admin')) {
      return resolver();
    }
  }

  if (!rule || rule.indexOf(role) > -1) {
    return resolver();
  }
  return Promise.reject(new Error('Unauthorized'));
};
