import jwt from 'jsonwebtoken';
import { GraphQLString } from 'graphql';

import { comparePwd } from '../../../utils/cryptPassword';
import Token from '../../types/token';
import CredentialInput from '../../inputs/credential';
import models from '../../../models';

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../../config/config.json`)[env];
const expiresIn = '7d';

export default {
  type: Token,
  args: {
    credential: {
      type: CredentialInput,
    },
  },
  resolve(source, { credential }) {
    const { username, password } = credential;
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
};
