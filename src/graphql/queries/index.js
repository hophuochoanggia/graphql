import base from './base';
import * as mapping from '../mapping';

const query = {};
Object.values(mapping).forEach((m) => {
  Object.values(base).forEach((method) => {
    query[method.name(m)] = method.resolver(m);
  });
});
export default query;
