"use strict";

import User from "../models/user.model.js";

export default {
  findUserByEmail: async (email) => {
    return await User.findOne({ email }).populate({
      path: "role",
      select: "name",
    });
  },

  findUserById: async (id) => {
    return await User.findOne({ _id: id });
  },

  updateUserToken: async (email, token) => {
    return await User.updateOne({ email: email }, { refreshToken: token });
  },

  createUser: async (data) => {
    return await User.create(data);
  },

  findUsersByRole: async (role) => {
    return await User.find({ role });
  },

  updateUserRole: async (id, role) => {
    return await User.updateMany({ _id: id }, { role: role });
  },
};
