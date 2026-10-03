import User from "../models/userSchema.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessToken = (id) => {
  return jwt.sign({ sub: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30m",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ sub: id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "15d",
  });
};
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, tel } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "User already exists",
    });
  }
  const user = await User.create(req.body);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    success: true,
    accessToken,
    user: {
      name: name,
      id: user._id,
      email: email,
      tel: tel,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({
      success: false,
      error: "User not found",
    });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      error: "Incorrect password",
    });
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    success: true,
    accessToken,
    user: {
      name: user.name,
      id: user._id,
      email: email,
      tel: user.tel,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, error: "No refresh token provided" });
  }
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.sub).select("+refreshToken");
  if (!user) {
    return res.status(400).json({ success: false, error: "User not found" });
  }
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully" });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, error: "No refresh token provided" });
  }
  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.sub);
  if (!user) {
    return res.status(400).json({ success: false, error: "User not found" });
  }
  const accessToken = generateAccessToken(user._id);
  res.status(200).json({
    success: true,
    accessToken,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  if (req.body.newPassword === req.body.currentPassword) {
    throw ApiError.badRequest(
      "New password cannot be the same as the current password",
    );
  } else if (
    req.body.newPassword.length < 8 ||
    req.body.newPassword.length > 20
  ) {
    throw ApiError.badRequest(
      "Password must be between 8 and 20 characters long",
    );
  }
  const user = await User.findById(req.user._id).select(
    "+password +refreshToken",
  );

  if (user) {
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest("Password not matched");
    }
    user.password = req.body.newPassword;
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      success: true,
      accessToken,
      message: "Password changed successfully",
    });
  } else {
    throw ApiError.notFound("User not found");
  }
});
