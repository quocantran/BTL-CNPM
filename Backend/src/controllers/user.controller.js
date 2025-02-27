"use strict";

import { CREATED, OK } from "../core/success.response.js";
import UserService from "../services/user.service.js";

class UserController {
  static findAll = async (req, res) => {
    return new OK({
      message: "Get users",
      metadata: await UserService.findAll(req.query),
    }).sendResponse(res);
  };

  static create = async (req, res) => {
    return new CREATED({
      message: "User created successfully",
      metadata: await UserService.create(req.body),
    }).sendResponse(res);
  };

  static update = async (req, res) => {
    return new OK({
      message: "User updated successfully",
      metadata: await UserService.update({ id: req.params.id, data: req.body }),
    }).sendResponse(res);
  };

  static delete = async (req, res) => {
    return new OK({
      message: "User deleted successfully",
      metadata: await UserService.delete(req.params.id),
    }).sendResponse(res);
  };
}

export default UserController;
