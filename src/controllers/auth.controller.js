"use strict";

import { OK } from "../core/success.response.js";
import AuthService from "../services/auth.service.js";

class AuthController {
  static login = async (req, res, next) => {
    return new OK({
      message: "Login success",
      metadata: await AuthService.login("admin"),
    }).sendResponse(res);
  };
}

export default AuthController;
