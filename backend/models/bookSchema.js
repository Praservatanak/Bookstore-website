import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    formats: [
      {
        type: String,
        enum: ["Paperback", "Hardcover", "E-book", "Audiobook"],
      },
    ],

    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    genres: [
      {
        type: String,
        trim: true,
      },
    ],

    publisher: {
      type: String,
      trim: true,
    },

    publishedDate: {
      type: Date,
    },

    coverImage: {
      type: String,
      trim: true,
    },

    language: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Book", bookSchema);
