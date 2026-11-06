import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,  // Deux utilisateurs ne peuvent pas avoir le même e-mail
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { 
      type: String, 
      required: true, 
      select: false // Exclut ce champ des requêtes par défaut
       },
       role: { type: String,
       enum: ["user", "admin"], 
       default: "user", 
       immutable: true }, //Mongoose refuse de modifier ce champ après la création
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const User = mongoose.model("User", userSchema);