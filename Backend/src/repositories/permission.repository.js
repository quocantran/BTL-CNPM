"use strict";

import Permission from "../models/permission.model.js";

export default {
  existsByMethodAndApipath: async (method, apiPath) => {
    return await Permission.findOne({ method: method, apiPath: apiPath });
  },
};
