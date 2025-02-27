"use strict";

const fileValidation = function (file) {
  const ext = file.mimetype.split("/")[1];
  const allowedFormats = ["png", "jpg", "jpeg", "webp"];
  return allowedFormats.includes(ext) ? ext : "jpeg";
};

export { fileValidation };
