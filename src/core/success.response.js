"use strict";

import {
  StatusCodeSuccess,
  ResponseMessageSuccess,
} from "../constants/index.js";

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodeSuccess.OK,
    metadata = {},
    responseStatusCode = ResponseMessageSuccess.OK,
  }) {
    this.message = responseStatusCode ? responseStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  sendResponse(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = StatusCodeSuccess.CREATED,
    responseStatusCode = ResponseMessageSuccess.CREATED,
  }) {
    super({ message, statusCode, metadata, responseStatusCode });
  }
}

export { OK, CREATED };
