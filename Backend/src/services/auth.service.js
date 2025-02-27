"use strict";

import {
  BadRequestException,
  UnauthorizedException,
} from "../core/error.response.js";
import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import JwtService from "../services/jwt.service.js";
import roleRepository from "../repositories/role.repository.js";

class AuthService {
  static login = async (data, res) => {
    const { email, password } = data;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException("Email or password is incorrect");
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException("Email or password is incorrect");
    }

    const token = await JwtService.generateTokenPair(user);

    await userRepository.updateUserToken(user.email, token.refreshToken);

    const role = await roleRepository.findRoleByName(user.role.name);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: role.permissions ?? [],
      },
      access_token: token.accessToken,
    };
  };

  static register = async (data) => {
    const { email, password, name } = data;

    const user = await userRepository.findUserByEmail(email);

    if (user) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const roleUser = await roleRepository.findRoleByName("NORMAL_USER");

    const newUser = await userRepository.createUser({
      email,
      password: hashedPassword,
      name,
      role: roleUser._id,
    });

    return {
      email: newUser.email,
      name: newUser.name,
    };
  };

  static logout = async (refreshToken, res) => {
    const userDecoded = await JwtService.verifyRefreshToken(refreshToken);

    res.clearCookie("refreshToken");

    await userRepository.updateUserToken(userDecoded._id, null);
  };

  static refreshToken = async (refreshToken, res) => {
    const userDecoded = await JwtService.verifyRefreshToken(refreshToken);
    const user = await userRepository.findUserByEmail(userDecoded.email);

    if (!user) {
      throw new UnauthorizedException("Unauthorized!");
    }

    const token = await JwtService.generateTokenPair(user);

    await userRepository.updateUserToken(user.email, token.refreshToken);

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      access_token: token.accessToken,
    };
  };

  static getCurrentUser = async (userDecoded) => {
    const user = await userRepository.findUserByEmail(userDecoded.email);
    if (!user) {
      throw new UnauthorizedException("Unauthorized!");
    }
    const role = await roleRepository.findRoleByName(user.role.name);
    return {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: role.permissions ?? [],
      },
    };
  };
}

export default AuthService;
