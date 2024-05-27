import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import adminModel from "../models/admin-schema";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user: any; // or the actual type of your user
    }
  }
}

const adminAuthGuard = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token found" });

  try {
    jwt.verify(
      token,
      process.env.secret_key!,
      async (err: any, payload: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "token expires" });
          }
          return res.status(401).json({ message: "Invalid token", error: err });
        }

          const type = payload.type;
          if (type == "admin") {
              req.user = payload;
              next();
          } else {
                return res.status(401).json({ message: "You are not admin" });
          } 
      }
    );
  } catch (e) {
    res.status(401).json({ message: "error degat", error: e });
  }
};

export default adminAuthGuard;

