"use strict";

import { CREATED, OK } from "../core/success.response.js";
import AuthService from "../services/auth.service.js";

class AuthController {
  static login = async (req, res, next) => {
    return new OK({
      message: "Login success",
      metadata: await AuthService.login(req.body, res),
    }).sendResponse(res);
  };

  static register = async (req, res, next) => {
    return new CREATED({
      message: "Register success",
      metadata: await AuthService.register(req.body),
    }).sendResponse(res);
  };

  static refreshToken = async (req, res) => {
    return new OK({
      message: "Refresh token success",
      metadata: await AuthService.refreshToken(req.cookies.refreshToken, res),
    }).sendResponse(res);
  };

  static getCurrentUser = async (req, res) => {
    return new OK({
      message: "Get current user success",
      metadata: await AuthService.getCurrentUser(req.user.dataUser),
    }).sendResponse(res);
  };

  static logout = async (req, res) => {
    return new OK({
      message: "Logout success",
      metadata: await AuthService.logout(req.cookies.refreshToken, res),
    }).sendResponse(res);
  };
}

export default AuthController;
