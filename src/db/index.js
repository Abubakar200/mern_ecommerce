import mongoose from "mongoose";

import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectString = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`Database host: ${connectString.connection.host}`);
  } catch (error) {
    console.log("Error in mongodb connection string: ", error);
    process.exit(1);
  }
};

export default connectDB