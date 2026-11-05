
import "dotenv/config"; 
import mongoose from "mongoose"; 
import { connectDB } from "../config/db.js"; 
import { Product } from "../models/Product.js";
import { sampleProducts } from "../data/sampleProducts.js"; 

// Check if the application is running in production
if (process.env.NODE_ENV === "production") {

  // Display an error message because this script deletes existing products
  console.error("Refusé : ce script efface les produits, il ne doit pas tourner en production.");

  // Stop the script immediately with an error status
  process.exit(1);
}


// Start a try/catch/finally block to handle errors and guarantee database disconnection
try {

  await connectDB();
  await Product.deleteMany({});   // Delete all existing products from the products collection
  const created = await Product.insertMany(sampleProducts); // Insert all sample products into MongoDB
  console.log(`${created.length} produits insérés.`);

} catch (err) {
  console.error("Échec du peuplement :", err.message);
  process.exitCode = 1;   // Set the process exit code to 1 to indicate that the script failed


// Execute this block whether the script succeeds or fails
} finally {

  // Disconnect Mongoose from MongoDB to close the database connection
  await mongoose.disconnect();
}
