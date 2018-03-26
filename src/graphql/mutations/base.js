import { resolverWithRole } from '../../utils/resolverWithRole';
import capitalize from '../../utils/capitalize';
import models from '../../models';

export default {
  create: {
    name: args => `create${capitalize(args.model)}`,
    resolver: args => ({
      ...args,
      resolve: (source, { input }, { role = null }) =>
        resolverWithRole(`create${capitalize(args.model)}`, role, {}, () =>
          models[args.model].create(input).then(({ id }) => models[args.model].findById(id))),
    }),
  },
  editById: {
    name: args => `edit${capitalize(args.model)}ById`,
    resolver: args => ({
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
            () => instance.update(input),
          )),
    }),
  },
};
