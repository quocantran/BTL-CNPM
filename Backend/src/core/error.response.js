"use strict";

import { StatusCodeError, ResponseMessageError } from "../constants/index.js";

class ErrorResponse extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export class BadRequestException extends ErrorResponse {
  constructor(
    message = ResponseMessageError.BADREQUEST,
    status = StatusCodeError.BADREQUEST
  ) {
    super(message, status);
  }
}

export class UnauthorizedException extends ErrorResponse {
  constructor(
    message = ResponseMessageError.UNAUTHORIZED,
    status = StatusCodeError.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

export class ForbiddenException extends ErrorResponse {
  constructor(
    message = ResponseMessageError.FORBIDDEN,
    status = StatusCodeError.FORBIDDEN
  ) {
    super(message, status);
  }
}
