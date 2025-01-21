import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: String,
  size: Number,
  type: String,
  data: Buffer,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  images: [imageSchema],
});

export default mongoose.model("User", userSchema);
