"use strict";
import jwt from "jsonwebtoken";
import {
  ForbiddenException,
  UnauthorizedException,
} from "../core/error.response.js";
import { asyncHandler } from "../utils/index.js";
import userRepository from "../repositories/user.repository.js";
import roleRepository from "../repositories/role.repository.js";
import { match } from "path-to-regexp";

const authMiddleware = asyncHandler(async (req, res, next) => {
  // get bearer token from header

  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    throw new UnauthorizedException("Unauthorized!");
  }

  const token = bearerToken.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await userRepository.findUserByEmail(decoded.dataUser.email);

    if (!user) {
      throw new UnauthorizedException("Unauthorized!");
    }
    req.user = decoded;
    next();
  } catch (err) {
    throw new UnauthorizedException("Unauthorized!");
  }
});

const checkPermission = asyncHandler(async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      throw new UnauthorizedException("Unauthorized!");
    }

    const token = bearerToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const userDecoded = decoded.dataUser;
    if (userDecoded.role === "ADMIN") {
      next();
    } else {
      const path = req.path;
      const method = req.method;
      const userInDb = await userRepository.findUserByEmail(userDecoded.email);
      const role = await roleRepository.findRoleByName(userInDb.role.name);

      const permission = role.permissions.find(
        (p) =>
          match(p.apiPath, {
            decode: decodeURIComponent,
          })(path) && p.method === method
      );
      if (permission) {
        next();
      } else {
        throw new ForbiddenException(
          "You don't have permission to access this resource!"
        );
      }
    }
  } catch (err) {
    if (err instanceof ForbiddenException) {
      throw err;
    }
    console.log(err);
    throw new UnauthorizedException("Unauthorized!");
  }
});

export { authMiddleware, checkPermission };
