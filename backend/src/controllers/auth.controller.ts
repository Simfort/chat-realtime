import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";

export const signup = async (req: Request, res: Response) => {
  const { fullName, email, password }: IUser = req.body;
  try {
    // hash password
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = User.findUser({ email });
    if (user) res.status(400).json({ message: "Email already exists" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = User.addUser({
      id: Math.random() * 1000,
      fullName,
      email,
      password: hashedPassword,
      profilePic: "",
    });

    if (newUser) {
      generateToken(newUser.id!, res);
      res.status(201).json({
        _id: newUser.id!,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in signup controller", error!.message);
    } else {
      console.log(error);
    }
    res.status(400).json({ message: "Error" });
  }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = User.findUser({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    } else {
      const isPassworCorrect = await bcrypt.compare(password, user.password);
      if (!isPassworCorrect) {
        res.status(400).json({ message: "Invalid credentials" });
      }

      generateToken(user.id!, res);
      res.status(200).json({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error in login", err.message);
    }
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Error in logout controller", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { profilePic } = req.body;
    const userId = (req as any).user.id;
    if (!profilePic) {
      res.status(400).json({ message: "Profile pic is required" });
    }
    const uploatedUser = User.updateUser(userId, {
      profilePic,
    });
    res.status(200).json(uploatedUser);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    res.status(200).json((req as any).user);
  } catch (e) {
    console.log("error in checkauth controller");
    res.status(500).json({ message: "Internal Server Error" });
  }
};
