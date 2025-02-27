"use strict";

import { BadRequestException } from "../core/error.response.js";
import { OK } from "../core/success.response.js";
import UploadService from "../services/upload.service.js";

class UploadController {
  static uploadFile = async (req, res) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestException("File is required");
    }
    new OK({
      message: "Success",
      metadata: await UploadService.uploadFile(file),
    }).sendResponse(res);
  };
}

export default UploadController;
