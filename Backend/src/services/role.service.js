"use strict";

import { BadRequestException } from "../core/error.response.js";
import Role from "../models/role.model.js";
import userRepository from "../repositories/user.repository.js";
import aqp from "api-query-params";
import Permission from "../models/permission.model.js";
import roleRepository from "../repositories/role.repository.js";

class RoleService {
  static createRole = async (data) => {
    const { name, description, permissions } = data;

    const roleExist = await Role.findOne({ name });

    if (roleExist) {
      throw new BadRequestException("Role already exist");
    }

    if (permissions?.length > 0) {
      const permissionInDb = await Permission.find({
        _id: { $in: permissions },
      });
      if (permissionInDb.length !== permissions.length) {
        throw new BadRequestException("Permission not found");
      }
    }

    const role = new Role({
      name,
      description,
      permissions,
    });

    return await Role.create(role);
  };

  static findAll = async (qs) => {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const totalRecord = (await Role.find(filter)).length;
    const limit = qs.pageSize ? parseInt(qs.pageSize) : 10;
    const totalPage = Math.ceil(totalRecord / limit);
    const skip = (qs.current - 1) * limit;
    const current = qs.current ? +qs.current : 1;
    const roles = await Role.find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate(population);

    return {
      meta: {
        current: current,
        pageSize: limit,
        pages: totalPage,
        total: totalRecord,
      },
      result: roles,
    };
  };

  static updateRole = async ({ id, data }) => {
    const role = await Role.findOne({ _id: id });

    if (!role) {
      throw new BadRequestException("Role not found");
    }
    if (data.permissions?.length > 0) {
      try {
        const permissionInDb = await Permission.find({
          _id: { $in: data.permissions },
        });
        if (permissionInDb.length !== data.permissions.length) {
          throw new BadRequestException("Permission not found");
        }
      } catch (err) {
        throw new BadRequestException("Permission not found");
      }
    }
    return await Role.updateOne({ _id: id }, { ...data });
  };

  static getRoleById = async (id) => {
    const role = await roleRepository.findRoleById(id);

    if (!role) {
      throw new BadRequestException("Role not found");
    }

    return role;
  };

  static deleteRole = async (id) => {
    const role = await Role.findOne({ _id: id });

    if (!role) {
      throw new BadRequestException("Role not found");
    }

    if (role.name !== "NORMAL_USER") {
      const roleUser = await Role.findOne({ name: "NORMAL_USER" });

      const users = await userRepository.findUsersByRole(role);

      if (users.length > 0) {
        await Promise.all(
          users.map(async (user) => {
            console.log(user);
            await userRepository.updateUserRole(user._id, roleUser);
          })
        );
      }
    }

    return await Role.deleteOne({ _id: id });
  };
}

export default RoleService;
