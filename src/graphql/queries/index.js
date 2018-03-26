import base from './base';

import user from '../mapping/user';
import eventType from '../mapping/eventType';

export default {
  user: base.findById(user),
  users: base.find(user),

  eventType: base.findById(eventType),
  eventTypes: base.find(eventType),
};
