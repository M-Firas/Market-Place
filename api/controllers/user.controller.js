import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import * as CustomError from '../errors/index.js';
import { cookiesToResponse, createTokenUser } from '../utils/index.js'


// update user controller 
export const updateUser = async (req, res) => {

  const { username, email, password, avatar } = req.body

  // checking if the user has provided all the values
  if (!username || !email || !password || !avatar) {
    throw new CustomError.BadRequestError("please provide all the values!")
  }

  // searching for the user and saving it after providing the new values
  const user = await User.findOne({ _id: req.user.userId })
  user.email = email
  user.username = username
  user.password = password
  user.confirmPassword = password;
  user.avatar = avatar

  await user.save();

  const tokenUser = createTokenUser(user);
  cookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.OK).json({ user: tokenUser });

}

// delete user controller 
export const deleteUser = async (req, res) => {

  // searching for the user if exists
  const user = await User.findOne({ _id: req.user.userId })
  if (!user) {
    throw new CustomError.BadRequestError("user not found!")
  }

  await user.deleteOne();

  // Clear the token cookie
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: true,
    sameSite: 'none',
  });

  res.status(StatusCodes.OK).json({ msg: 'User account deleted successfully' });
}

// get single user controller
export const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  //checking if the user exists
  if (!user) {
    throw new CustomError.NotFoundError(
      `no user exists with id : ${req.params.id}`
    );
  }

  res.status(StatusCodes.OK).json({ user });
};

