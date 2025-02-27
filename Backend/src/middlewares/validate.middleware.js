"use strict";

import { validationResult } from "express-validator";
import { BadRequestException } from "../core/error.response.js";

const validateData = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new BadRequestException(errors.array()[0].msg);
  }
  next();
};

export { validateData };
