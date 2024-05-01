import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import doctormodel from "../models/doctor-schema";
import dotenv from "dotenv";
dotenv.config();

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get the token from the 'Authorization' header
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>

    try {
      const decoded = jwt.verify(token, process.env.secret_key as string);

      // Find the user in the database
      const user = await doctormodel.findById(decoded._id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user to the request object
      req.user = user;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Authorization header not found" });
  }
};
