import express from "express";
import {
  getAllBooks,
  getOneBook,
  createOneBook,
  updateOneBook,
  deleteOneBook,
} from "../controllers/bookController.js";
import { protect } from "../middlewares/protect.js";
import { authorize } from "../middlewares/authorize.js";
const router = express.Router();
router.use(protect);
router.get("/", getAllBooks);
router.post("/", authorize("admin"), createOneBook);
router.get("/:id", getOneBook);
router.patch("/:id", authorize("admin"), updateOneBook);
router.delete("/:id", authorize("admin"), deleteOneBook);

export default router;
