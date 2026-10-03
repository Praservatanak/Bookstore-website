import express from "express";
import {
  register,
  login,
  logout,
  refresh,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middlewares/protect.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/refresh", refresh);
router.patch("/change-password", protect, changePassword);
export default router;
