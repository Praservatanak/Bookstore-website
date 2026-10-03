import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be 1 or more"],
        },
        format: {
          type: String,
          required: true,
          enum: ["Paperback", "Hardcover", "E-book", "Audiobook"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
