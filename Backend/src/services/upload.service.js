"use strict";

import cloudinary from "../configs/cloudinary.config.js";
import { BadRequestException } from "../core/error.response.js";

class UploadService {
  static uploadFile = async (file) => {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
      });

      return {
        url: result.secure_url,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Error upload file");
    }
  };
}

export default UploadService;
