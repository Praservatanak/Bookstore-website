import express from "express";
import {
  getAllUser,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/protect.js";
import { authorize } from "../middlewares/authorize.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllUser);
router.delete("/:id", protect, authorize("admin"), deleteOneUser);
router.get("/:id", protect, authorize("admin"), getOneUser);
router.patch("/:id", protect, authorize("admin"), updateOneUser);

export default router;
