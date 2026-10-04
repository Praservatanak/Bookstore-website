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
        book: {
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
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.pre("save", async function () {
  await this.populate("books.book", "title price");

  this.totalPrice = this.books.reduce((total, item) => {
    return total + item.book.price * item.quantity;
  }, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
