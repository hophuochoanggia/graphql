import { relay } from 'graphql-sequelize';
import models from '../../models';

const { sequelizeNodeInterface } = relay;
export default sequelizeNodeInterface(models);
