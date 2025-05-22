import mongoose from "mongoose";

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import BlacklistModel from "../models/blacklist.model.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a new user
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUsers = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // Generate a token
    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      status: true,
      message: "User created successfully",
      date: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      const err = new Error("Invalid password");
      err.statusCode = 404;
      throw err;
    }

    // if valid Generate a token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({
      status: true,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {

    let token = req.token;
    if (!token) return res.sendStatus(204);

    const checkIfBlacklisted = await BlacklistModel.findOne({ token: token });

    if (checkIfBlacklisted) return res.sendStatus(401).json({ message: "Invalid User data" });

    const newBlacklist = await BlacklistModel.create([ { token, user: req.user._id}]);

    if (!newBlacklist) {
      const error = new Error("Error signing out");
      error.statusCode = 500;
      throw error;
    }

    res.setHeader("Clear-Site-Data", '"cookies"');

    res.status(200).json({ message: "You are logged out!" });

  } catch (error) {

    next(error);

  }
};
