"use strict";

import { CREATED, OK } from "../core/success.response.js";
import RoleService from "../services/role.service.js";

class RoleController {
  static createRole = async (req, res) => {
    return new CREATED({
      message: "Create role success",
      metadata: await RoleService.createRole(req.body),
    }).sendResponse(res);
  };

  static findAll = async (req, res) => {
    return new OK({
      message: "Find all role",
      metadata: await RoleService.findAll(req.query),
    }).sendResponse(res);
  };

  static updateRole = async (req, res) => {
    return new OK({
      message: "Update role success",
      metadata: await RoleService.updateRole({
        id: req.params.id,
        data: req.body,
      }),
    }).sendResponse(res);
  };

  static getRoleById = async (req, res) => {
    return new OK({
      message: "Get role by id success",
      metadata: await RoleService.getRoleById(req.params.id),
    }).sendResponse(res);
  };

  static deleteRole = async (req, res) => {
    return new OK({
      message: "Delete role success",
      metadata: await RoleService.deleteRole(req.params.id),
    }).sendResponse(res);
  };
}

export default RoleController;
