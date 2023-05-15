import mongoose from "mongoose";

//to connect to mongo Atlas
export async function connectToDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Database Connection Established! \n----");

  } catch (error) {
    console.error(error.message);
  }
}
