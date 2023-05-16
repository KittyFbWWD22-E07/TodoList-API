import mongoose from "mongoose";
import { seedDatabase } from "./seeds.js";

//to connect to mongo Atlas
export async function connectToDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Database Connection Established! \n----");
    await seedDatabase(20);
  } catch (error) {
    console.error(error.message);
  }
}
