import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { NextFunction, Request, Response } from "express";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Unawthorized - No Token Provided" });
    }

    const decoded: { userId: number } = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    if (!decoded) {
      res.status(401).json({ message: "Unawthorized - Invalid Token" });
    }
    const user = User.findUser({ id: decoded.userId });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    (req as any).user = user;

    next();
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("Error middleware", e.message);
    }
  }
};
