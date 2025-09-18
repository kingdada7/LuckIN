import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    organizationToken: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  { timestamps: true }
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
