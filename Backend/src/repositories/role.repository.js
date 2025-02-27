"use strict";

import Role from "../models/role.model.js";

export default {
  findRoleByName: async (name) => {
    return await Role.findOne({ name: name }).populate({
      path: "permissions",
    });
  },
  findRoleById: async (id) => {
    return await Role.findOne({ _id: id }).populate({
      path: "permissions",
      select: "module name apiPath method",
    });
  },
};
