"use strict";

import jwt from "jsonwebtoken";
import _ from "lodash";
import { UnauthorizedException } from "../core/error.response.js";
import roleRepository from "../repositories/role.repository.js";
class JwtService {
  static generateTokenPair = async (user) => {
    const role = await roleRepository.findRoleById(user.role);
    const dataUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: role.name,
    };
    const accessToken = jwt.sign({ dataUser }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    });

    const refreshToken = jwt.sign(
      { dataUser },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }
    );

    return { accessToken, refreshToken };
  };

  static verifyRefreshToken = async (refreshToken) => {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return decoded.dataUser;
    } catch (err) {
      throw new UnauthorizedException("Refresh token is invalid");
    }
  };

  static verifyAccessToken = async (accessToken) => {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return decoded.dataUser;
    } catch (err) {
      throw new UnauthorizedException("Access token is invalid");
    }
  };
}

export default JwtService;
