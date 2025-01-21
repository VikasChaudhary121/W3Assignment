import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export const SignUp = async (req, res) => {
  try {
    const { username, password, handle } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password should be of minimum length 6" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      handle,
      images: [],
    });

    await newUser.save();

    generateTokenAndSetCookie(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      handle: newUser.handle,
      images: newUser.images,
    });
  } catch (err) {
    console.error("Error in signup controller:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      handle: user.handle,
      images: user.images,
    });
  } catch (err) {
    console.error("Error in login controller:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error in logout controller:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
