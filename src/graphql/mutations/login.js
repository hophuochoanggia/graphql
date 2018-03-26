import jwt from 'jsonwebtoken';

import { comparePwd } from '../../utils/cryptPassword';
import models from '../../models';
import Token from '../types/token';
import CredentialInput from '../inputs/credential';

const expiresIn = '7d';
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

export default {
  name: () => 'login',
  resolver: () => ({
    type: Token,
    args: {
      input: {
        type: CredentialInput,
      },
    },
    resolve(source, { input }) {
      const { username, password } = input;
      return models.user.find({ where: { username } }).then(async (user) => {
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
};
