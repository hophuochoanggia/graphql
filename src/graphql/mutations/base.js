import jwt from 'jsonwebtoken';

import { comparePwd } from '../../utils/cryptPassword';
import { resolverWithRole } from '../../utils/resolverWithRole';
import capitalize from '../../utils/capitalize';
import models from '../../models';
import Token from '../types/token';
import CredentialInput from '../inputs/credential';

const expiresIn = '7d';
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

export default {
  login: () => ({
    type: Token,
    args: {
      input: {
        type: CredentialInput,
      },
    },
    resolve(source, { input }) {
      const { username, password } = input;
      return models.user.find({ where: { username } }).then(async user => {
        if (user) {
          const compare = await comparePwd(password, user.password);
          if (compare) {
            const payload = {
              id: user.id,
              user: user.username,
              role: user.role,
            };
            const token = jwt.sign(payload, config.SECRET, {
              expiresIn,
            });
            return Promise.resolve({ message: 'Success', token });
          }
          return Promise.reject(new Error('Login fails'));
        }
        return Promise.reject(new Error('No user found'));
      });
    },
  }),
  create: args => ({
    ...args,
    resolve: (source, { input }, { role = null }) =>
      resolverWithRole(`create${capitalize(args.model)}`, role, {}, () =>
        models[args.model]
          .create(input)
          .then(({ id }) => models[args.model].findById(id))
      ),
  }),
  editById: args => ({
    ...args,
    resolve: (source, { id, input }, { user }) =>
      models[args.model].findById(id).then(instance =>
        resolverWithRole(
          `edit${capitalize(args.model)}ById`,
          user.role,
          {
            id,
            ownerId: user.id,
            instance,
            model: 'user',
          },
          () => instance.update(input)
        )
      ),
  }),
};
