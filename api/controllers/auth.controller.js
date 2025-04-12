import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import * as CustomError from '../errors/index.js';
import { cookiesToResponse, createTokenUser } from '../utils/index.js'




export const signup = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  // checking if the user exist
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new CustomError.BadRequestError("Email is Taken!");
  }

  const newUser = new User({ username, email, password });
  newUser.confirmPassword = confirmPassword;

  // saving the user
  await newUser.save();
  res.status(StatusCodes.CREATED).json({ msg: "User Created Successfully" });



};

export const login = async (req, res, next) => {
  const { email, password } = req.body
  // checking if the email and password are provided
  if (!email || !password) {
    throw new CustomError.BadRequestError("please provide email and password!")
  }
  // checking if the user exist
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.BadRequestError("invalid Email or Password!");
  }

  //checking if the password is correct 
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invaild Email or Password')
  }

  // attaching cookie and signing the user in
  const tokenUser = createTokenUser(user);
  cookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ user: tokenUser })

}