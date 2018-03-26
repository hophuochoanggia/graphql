import base from './base';
import user from '../mapping/user';
import eventType from '../mapping/eventType';
import event from '../mapping/event';

export default {
  login: base.login(),
  createUser: base.create(user),
  editUserById: base.editById(user),

  createEventType: base.create(eventType),
  editEventTypeById: base.editById(eventType),

  createEvent: base.create(event),
  editEventById: base.editById(event),
};
