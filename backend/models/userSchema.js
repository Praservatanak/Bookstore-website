import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [20, "Password must be at most 20 characters long"],
      select: false,
    },
    tel: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          const khPhoneRegex = /^\+855[\s-]?\d{2,3}[\s-]?\d{3}[\s-]?\d{3,4}$/;
          return khPhoneRegex.test(value);
        },
        message: "Phone must be a valid Cambodian number starting with +855",
      },
    },
    role: {
      type: String,
      lowercase: true,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const hashPassword = await bcrypt.hash(this.password, 12);
  this.password = hashPassword;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};
const User = mongoose.model("User", userSchema);
export default User;
