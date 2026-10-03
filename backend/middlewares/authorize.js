import ApiError from "../utils/apiError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("Not authorized to access this route");
    }
    next();
  };
};
