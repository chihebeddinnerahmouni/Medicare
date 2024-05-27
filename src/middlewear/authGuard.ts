import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import findUserById from "../utils/find-user-by-id-and-type";
dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user: any; // or the actual type of your user
    }
  }
}

const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token found' });

  try {
    jwt.verify(token, process.env.secret_key!, async (err: any, payload: any) => {
      
      if (err) {
        if (err.name === 'TokenExpiredError') return res.status(401).json({ message: 'token expires' });
        
        return res.status(401).json({ message: 'Invalid token', error: err });
      } 

        /*const id = payload.id;
        const type = payload.type;
        const tokenVersion = payload.tokenVersion;
        const user = await findUserById(req, res, type, id);
      
        if (user.tokenVersion !== tokenVersion) {
            user.online = false;
            user.token = "";
            user.tokenVersion += 1;
          await user.save();
          return res.status(401).json({ message: 'token version not matched and u r logged out' });
        }*/
      

        req.user = payload;
        next();
      
    });
  } catch (e) {
    res.status(401).json({ message: 'error degat', error: e });
  }
}

export default authGuard;







/*const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token found" });
  try {
    jwt.verify(
      token,
      process.env.secret_key!,
      async (err: any, payload: any) => {
        if (!payload)
          return res.status(401).json({ message: "Invalid payload" });

        const id = payload.id;
        const type = payload.type;
        const tokenVersion = payload.tokenVersion;
        const user = await findUserById(req, res, type, id);

        if (err) {
          if (
            err.name === "TokenExpiredError" ||
            user.tokenVersion === tokenVersion
          ) {
            payload.online = false;
            user.token = "";
            user.tokenVersion += 1;
            await user.save();
            return res.status(401).json({
              message: "loged out succesfully (token expired or token version)",
            });
          } else {
            return res
              .status(401)
              .json({ message: "Unauthorized", error: err });
          }
        }

        req.user = payload;
        next();
      }
    );
  } catch (e) {
    res.status(401).json({ message: "Unauthorized", error: e });
  }
// }*/


























/*const getTokenFromHeader = (authHeader: string | undefined) => {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  return token || null;
};

const decodeToken = (token: string | null) => {
  if (!token) return null;
  return jwt.decode(token);
};

const verifyToken = async (
  token: string | null,
  req: Request,
  res: Response,
  type: any,
  id: any
) => {
  if (!token) {
    return res.status(401).json({ message: "no token found" });
  }

  jwt.verify(token, process.env.secret_key!, async (err: any, user: any) => {
    const userfound = await findUserById(req, res, type, id);

    if (err && err.name === "TokenExpiredError") {
      userfound.online = false;
      userfound.token = "";
      userfound.tokenVersion += 1;
      await userfound.save();
      return res
        .status(401)
        .json({ message: "logged out successfully (token expired)" });
    } else if (userfound.tokenVersion !== user.tokenVersion) {
      console.log("user.tokenVersion", user.tokenVersion);
      console.log("tokenVersion", userfound.tokenVersion);
      return res.send("token version not matched");
    } else if (err) {
      return res.status(401).json({ message: "Unauthorized", err: err });
    }

    req.user = user;
  });
};
export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = getTokenFromHeader(authHeader);
  const decodedToken = decodeToken(token);

  if (typeof decodedToken === "object" && decodedToken !== null) {
    const id = decodedToken.id;
    const type = decodedToken.type;
    const tokenVersion = decodedToken.tokenVersion;
    console.log("authguard tokenVersion", tokenVersion);

    verifyToken(
      token,
      req,
      res,
      type,
      id
    );
    next();
  }
};*/









































  
