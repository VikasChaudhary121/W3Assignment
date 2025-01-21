import User from "../model/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      isAdmin: false,
      username: { $not: /^admin/i },
    }).select("-password -images");

    return res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getDetails = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ error: "Failed to fetch user details" });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const { username, handle } = req.body;

    if (!username || !handle) {
      return res
        .status(400)
        .json({ error: "Username and handle are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, handle, images: [] });
    }

    const newImages = req.files.map((file) => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      data: file.buffer,
    }));

    user.images.push(...newImages);
    await user.save();

    res.status(200).json({ message: "Images uploaded successfully", user });
  } catch (error) {
    console.error("Error uploading images:", error.message);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

export const retrieveImages = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user.images.map((img) => img.data.toString("base64")));

    const images = user.images.map((img) => ({
      name: img.name,
      type: img.type,
      data: img.data.toString("base64"),
    }));

    res.status(200).json({
      username: username,
      handle: user.handle,
      images: images,
    });
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
