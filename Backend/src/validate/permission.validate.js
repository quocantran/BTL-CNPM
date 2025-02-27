"use strict";

import { body } from "express-validator";

const validateRuleCreatePermission = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("apiPath")
    .notEmpty()
    .withMessage("apiPath is required")
    .isString()
    .withMessage("apiPath must be a string"),
  body("module")
    .notEmpty()
    .withMessage("module is required")
    .isString()
    .withMessage("module must be a string"),
  body("method")
    .notEmpty()
    .withMessage("method is required")
    .isString()
    .withMessage("method must be a string"),
];

export { validateRuleCreatePermission };
