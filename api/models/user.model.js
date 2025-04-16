import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { BadRequestError } from "../errors/index.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'please provide a username!'],
    },
    email: {
      type: String,
      required: [true, 'please provide an email'],
      validate: {
        validator: validator.isEmail,
        message: 'please provide a valid email',
      },
    },
    password: {
      type: String,
      required: [true, 'please provide a password'],
    },
    avatar: {
      type: String,
      default: "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
    }
  },
  { timestamps: true }
);

// Virtual field for confirmPassword
userSchema.virtual('confirmPassword')
  .set(function (value) {
    this._confirmPassword = value;
  })
  .get(function () {
    return this._confirmPassword;
  });

// Hashing the password
userSchema.pre('save', async function (next) {
  // If the password field is not modified, skip hashing
  if (!this.isModified('password')) return next();
  // Check if the passwords match (this._confirmPassword comes from virtual field)
  if (this.password !== this._confirmPassword) {
    throw new BadRequestError('Passwords do not match');
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Comparing the passwords
userSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};



const User = mongoose.model("User", userSchema);

export default User;
