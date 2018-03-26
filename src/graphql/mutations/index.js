import base from './base';
import login from './login';
import * as mapping from '../mapping';

const mutation = {};
Object.values(mapping).forEach((m) => {
  Object.values(base).forEach((method) => {
    mutation[method.name(m)] = method.resolver(m);
  });
});
mutation[login.name()] = login.resolver();
export default mutation;
