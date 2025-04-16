import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import * as CustomError from '../errors/index.js';
import { cookiesToResponse, createTokenUser } from '../utils/index.js'



// sign up controller 
export const signup = async (req, res) => {

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

// sign in controller 
export const login = async (req, res) => {

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

  // attaching token cookie and signing the user in
  const tokenUser = createTokenUser(user);
  cookiesToResponse({ res, user: tokenUser })

  res.status(StatusCodes.OK).json({ user: tokenUser })


}

// sign in via google controller
export const googleAuth = async (req, res) => {

  const user = await User.findOne({ email: req.body.email });

  if (user) {
    // attaching token cookie and signing the user in
    const tokenUser = createTokenUser(user);
    cookiesToResponse({ res, user: tokenUser });

    return res.status(StatusCodes.OK).json({ user: tokenUser });
  }

  const generatedPassword =
    Math.random().toString(36).slice(-8) +
    Math.random().toString(36).slice(-8);

  const newUser = new User({
    username:
      req.body.name.split(' ').join('').toLowerCase() +
      Math.random().toString(36).slice(-4),
    email: req.body.email,
    password: generatedPassword,
    avatar: req.body.photo,
  });

  newUser.confirmPassword = generatedPassword;
  await newUser.save();

  // attaching token cookie and signing the user in
  const tokenUser = createTokenUser(newUser);
  cookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });

};

// logout controller 
export const logout = async (req, res) => {

  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none',
  });

  res.status(200).json({ message: 'Successfully logged out' });

  console.error("Logout Error:", error);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error" });

};