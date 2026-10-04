import asyncHandler from "../utils/asyncHandler.js";
import Book from "../models/bookSchema.js";

export const getAllBooks = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  if (parseInt(page) <= 0) {
    return res.status(400).json({
      success: false,
      error: "Page must be greater than 0",
    });
  }
  if (parseInt(limit) < 1 || parseInt(limit) > 100) {
    return res.status(400).json({
      success: false,
      error: "Limit must be between 1 and 100",
    });
  }

  const result = await Book.paginate(
    {},
    {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: "-createdAt",
      customLabels: {
        docs: "books",
        totalDocs: "total",
        limit: "perPage",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        totalPages: "pages",
        pagingCounter: "serialNo",
        meta: "pagination",
      },
    },
  );
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getOneBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  res.status(200).json({
    success: true,
    book: book,
  });
});

export const createOneBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);

  res.status(201).json({
    success: true,
    book: book,
  });
});

export const updateOneBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  res.status(200).json({
    success: true,
    book: book,
  });
});

export const deleteOneBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }
  res.status(200).json({
    success: true,
    book: null,
  });
});
