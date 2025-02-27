"use strict";

import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import { BadRequestException } from "../core/error.response.js";
import aqp from "api-query-params";
import _ from "lodash";
import roleRepository from "../repositories/role.repository.js";

class UserService {
  static findAll = async (qs) => {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const totalRecord = (await User.find(filter)).length;
    const limit = qs.pageSize ? parseInt(qs.pageSize) : 10;
    const totalPage = Math.ceil(totalRecord / limit);
    const skip = (qs.current - 1) * limit;
    const current = qs.current ? +qs.current : 1;
    const users = await User.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select("-password -refreshToken")
      .populate(population);

    return {
      meta: {
        current: current,
        pageSize: limit,
        pages: totalPage,
        total: totalRecord,
      },
      result: users,
    };
  };

  static create = async (data) => {
    const { email, password, name, role } = data;

    const userExist = await userRepository.findUserByEmail(email);

    if (userExist) {
      throw new BadRequestException("User already exist");
    }
    let roleUser;

    if (!role) {
      roleUser = await roleRepository.findRoleByName("NORMAL_USER");
    } else {
      const roleExist = await roleRepository.findRoleById(role);
      if (!roleExist) {
        throw new BadRequestException("Role not found");
      }
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashPassword,
      name,
      role: role ? role : roleUser,
    });

    await User.create(user);

    return {
      email,
      name,
      role: role ? role : roleUser,
    };
  };

  static update = async ({ id, data }) => {
    const { role } = data;
    const user = await userRepository.findUserById(id);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (data.password) {
      delete data.password;
    }
    let roleUser;

    if (!role) {
      roleUser = await roleRepository.findRoleByName("NORMAL_USER");
    } else {
      const roleExist = await roleRepository.findRoleById(role);
      if (!roleExist) {
        throw new BadRequestException("Role not found");
      }
    }

    data.role = role ? role : roleUser;

    return await User.updateOne(
      { _id: id },
      {
        ...data,
      }
    );
  };

  static delete = async (id) => {
    const user = await userRepository.findUserById(id);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    return await User.deleteOne({ _id: id });
  };
}

export default UserService;
