"use strict";
import { body } from "express-validator";

const validateRuleCreateRole = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("Name must be a string"),
  body("description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("Name must be a string"),
];

export { validateRuleCreateRole };
