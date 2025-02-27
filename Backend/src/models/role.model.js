import mongoose from "mongoose";

const Schema = mongoose.Schema;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    permissions: {
      type: [Schema.Types.ObjectId],
      ref: "Permission",
      default: [],
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema, "roles");

export default Role;
