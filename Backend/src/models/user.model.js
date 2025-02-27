import mongoose, { Mongoose } from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },

    name: {
      type: String,
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

export default User;
