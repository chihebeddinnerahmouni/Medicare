import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();




export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const authheader = req.headers.authorization;
    const token = authheader && authheader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "no token found" });
    jwt.verify(token!, process.env.secret_key as string, async (err: any, user: any) => {
      if (err) return res.status(401).json({ message: "Unauthorized" });
      req.user = user;
    }
    );
  next();
};























/*export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => { 
  try { 
    const authheader = req.headers.authorization;
    const token = authheader && authheader.split(" ")[1];
    jwt.verify(token!, process.env.secret_key as string, async (err: any, user: any) => { 
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
    });
    next();
  }
  catch (error) {
    res.status(401).json({ message: "degat" , error: error});
  }
};*/
  
