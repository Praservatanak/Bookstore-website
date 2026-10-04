import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import { protect } from "../middlewares/protect.js";

const router = express.Router();
router.use(protect);

router.get("/", getCart);

router.post("/", addToCart);

router.patch("/:bookId", updateCartItem);

router.delete("/:bookId", removeFromCart);

router.delete("/", clearCart);

export default router;
