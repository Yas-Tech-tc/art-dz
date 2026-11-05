
import mongoose from "mongoose";
import { CATEGORY_IDS } from "../config/categories.js";

// Define the structure and validation rules of a product
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: CATEGORY_IDS,
    },

    imageUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    materials: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    dimensions: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
  },

  {   
    timestamps: true, // Automatically add createdAt and updatedAt
   
    toJSON: {     // Customize the product when converting it to JSON
      virtuals: true, // Include virtual properties such as inStock

      versionKey: false, // Hide the MongoDB version field (__v)

       transform: (doc, ret) => {     // Modify the JSON before returning it
        
        delete ret._id; // Remove the MongoDB ID from the JSON response

        
        return ret; // Return the modified JSON
      },
    },
  }
);

// Create a virtual property called "inStock"
// It returns true if the product has stock, otherwise false
productSchema.virtual("inStock").get(function () {
  return this.stock > 0;
});

// Create the Product model using the product schema
// The model allows us to interact with the MongoDB products collection
export const Product = mongoose.model("Product", productSchema);
