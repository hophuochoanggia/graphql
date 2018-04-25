import { userType } from '../type';

export default {
  type: userType.connectionType,
  args: {},
  resolve: (options, args, ctx, info) => userType.resolve(options, { id: ctx.id }, ctx, info)
};
