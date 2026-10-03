import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/userSchema.js";
import ApiError from "../utils/ApiError.js";

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  if (req.body.password) {
    throw ApiError.badRequest(
      "Cannot change password in this route. Use /api/auth/change-password instead.",
    );
  }
  const allowField = ["name", "age", "tel", "email"];
  const update = {};
  allowField.forEach((f) => {
    if (req.body[f] !== undefined) {
      update[f] = req.body[f];
    }
  });
  const user = await User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

export const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
