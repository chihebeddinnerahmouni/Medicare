import { Request, Response, NextFunction } from 'express';



export const verifyToken = (req: Request, res: Response) => {
    res.status(200).json({ message: "Token is valid" });
 }