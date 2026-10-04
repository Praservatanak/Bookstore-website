import Cart from "../models/cartSchema.js";
import Book from "../models/bookSchema.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate(
    "books.book",
    "title price",
  );

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { bookId, quantity = 1, format } = req.body;

  if (!bookId || !format) {
    return res.status(400).json({
      success: false,
      message: "Book and format are required",
    });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  let cart = await Cart.findOne({
    userId: req.user._id,
  });

  if (!cart) {
    cart = new Cart({
      userId: req.user._id,
      books: [
        {
          book: bookId,
          quantity,
          format,
        },
      ],
    });

    await cart.save();

    return res.status(201).json({
      success: true,
      cart,
    });
  }

  const existingItem = cart.books.find(
    (item) => item.book.toString() === bookId && item.format === format,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.books.push({
      book: bookId,
      quantity,
      format,
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { quantity, format } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be 1 or more",
    });
  }

  const cart = await Cart.findOne({
    userId: req.user._id,
  });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const item = cart.books.find(
    (item) => item.book.toString() === bookId && item.format === format,
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Book not found in cart",
    });
  }

  item.quantity = quantity;

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { format } = req.body;

  const cart = await Cart.findOne({
    userId: req.user._id,
  });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  const itemExists = cart.books.some(
    (item) => item.book.toString() === bookId && item.format === format,
  );

  if (!itemExists) {
    return res.status(404).json({
      success: false,
      message: "Book not found in cart",
    });
  }

  cart.books = cart.books.filter(
    (item) => !(item.book.toString() === bookId && item.format === format),
  );

  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({
    userId: req.user._id,
  });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found",
    });
  }

  cart.books = [];

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});
