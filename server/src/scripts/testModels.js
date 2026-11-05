import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Product } from "../models/Product.js";

await connectDB();

const bad = new Product({ name: "X", price: -5, category: "armes" });
const error = bad.validateSync();
console.log(Object.keys(error.errors));

await mongoose.disconnect();