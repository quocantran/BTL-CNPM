"use strict";

import { BadRequestException } from "../core/error.response.js";
import Permission from "../models/permission.model.js";
import Role from "../models/role.model.js";
import permissionRepository from "../repositories/permission.repository.js";
import aqp from "api-query-params";

class PerrmissionService {
  static createPermission = async (data) => {
    const { module, name, apiPath, method } = data;
    if (await permissionRepository.existsByMethodAndApipath(method, apiPath)) {
      throw new BadRequestException("Permission already exist");
    }

    const permission = new Permission({
      module,
      name,
      apiPath,
      method,
    });

    return await Permission.create(permission);
  };

  static findAll = async (qs) => {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const totalRecord = (await Permission.find(filter)).length;
    const limit = qs.pageSize ? parseInt(qs.pageSize) : 10;
    const totalPage = Math.ceil(totalRecord / limit);
    const skip = (qs.current - 1) * limit;
    const current = qs.current ? +qs.current : 1;
    const permissions = await Permission.find(filter)
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
      result: permissions,
    };
  };

  static updatePermission = async ({ id, data }) => {
    const permission = await Permission.findOne({ _id: id });
    if (!permission) {
      throw new BadRequestException("Permission not found");
    }
    return await Permission.updateOne({ _id: id }, { ...data });
  };

  static deletePermission = async (id) => {
    const permission = await Permission.findOne({ _id: id });
    if (!permission) {
      throw new BadRequestException("Permission not found");
    }
    return await Permission.deleteOne({ _id: id });
  };
}

export default PerrmissionService;
