import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb connected Successfully");
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};
