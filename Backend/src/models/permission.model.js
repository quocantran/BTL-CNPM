import mongoose from "mongoose";

const Schema = mongoose.Schema;

const permissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    apiPath: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      required: true,
    },

    module: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Permission = mongoose.model(
  "Permission",
  permissionSchema,
  "permissions"
);

export default Permission;
