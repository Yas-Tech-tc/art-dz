import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI est manquante dans le fichier .env");
  }

  mongoose.set("strictQuery", true); //C’est une petite protection contre les requêtes malformées.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }); //si la base est injoignable, on échoue en 10 secondes au lieu de 30

  console.log(`MongoDB connecté (base : ${mongoose.connection.name})`);
}