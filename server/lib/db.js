import mongoose from "mongoose";

// fuction to connect to mongodb database
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("database connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/FinancialTracker`);
  } catch (error) {
    console.log(error);
  }
};
