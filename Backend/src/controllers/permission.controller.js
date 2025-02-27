"use strict";

import { CREATED, OK } from "../core/success.response.js";
import PerrmissionService from "../services/permission.service.js";

class PermissionController {
  static createPermission = async (req, res) => {
    return new CREATED({
      message: "Create permission success",
      metadata: await PerrmissionService.createPermission(req.body),
    }).sendResponse(res);
  };
  static findAll = async (req, res) => {
    return new OK({
      message: "Find all permission",
      metadata: await PerrmissionService.findAll(req.query),
    }).sendResponse(res);
  };

  static updatePermission = async (req, res) => {
    return new OK({
      message: "Update permission success",
      metadata: await PerrmissionService.updatePermission({
        id: req.params.id,
        data: req.body,
      }),
    }).sendResponse(res);
  };

  static deletePermission = async (req, res) => {
    return new OK({
      message: "Delete permission success",
      metadata: await PerrmissionService.deletePermission(req.params.id),
    }).sendResponse(res);
  };
}

export default PermissionController;
