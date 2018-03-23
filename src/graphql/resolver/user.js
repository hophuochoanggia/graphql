import models from "../../models/index.js";
import { Op } from "sequelize";
const { user } = models;

export const createUser = data => user.create(data);
export const findUserById = id => user.findById(id);
export const findOneUser = filter => user.findOne(filter);
export const findAllUser = ({ username, offset, role }) => {
  let where = {};
  if (username) {
    where.username = {
      [Op.like]: `%${username}%`
    };
  }
  if (role) {
    where.role = {
      [Op.like]: `%${role}%`
    };
  }
  return user.findAll({
    where: where,
    attributes: { exclude: ["password"] },
    offset: offset,
    limit: 10
  });
};
