"use strict";
import { body } from "express-validator";

const validateRuleCreateUser = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isString()
    .withMessage("Password must be a string"),
  body("name").notEmpty().withMessage("Name is required"),
];

export { validateRuleCreateUser };
