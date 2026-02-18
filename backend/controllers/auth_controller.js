import User from "../models/user.js";
import ProviderProfile from "../models/provider_profile.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUpProvider = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Please fill all required fields");
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create learner user
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role: "provider",
    });

    const newProviderProfile = await ProviderProfile.create({
      user: newUser._id,
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

    res.status(201).json({
      success: true,
      message: "Provider registered successfully",
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const signUpPlayer = async (req, res, next) => {
  try {
    const { name, email, password} = req.body;

    if (!name || !email || !password) {
      throw new Error("All player fields are required");
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role: "player",
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

    res.status(201).json({
      success: true,
      message: "Player registered successfully",
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};



export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};