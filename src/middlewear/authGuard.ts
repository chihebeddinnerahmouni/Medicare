import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import findUserById from "../utils/find-user-by-id";
dotenv.config();


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
      const id = payload.id;
      const type = payload.type;
      const tokenVersion = payload.tokenVersion;
      const user = await findUserById(req, res, type, id);

      if (err) {
        if (
          err.name === "TokenExpiredError" &&
          user.tokenVersion === tokenVersion
        ) {
          payload.online = false;
          user.token = "";
          user.tokenVersion += 1;
          await user.save();
          return res
            .status(401)
            .json({
              message: "loged out succesfully (token expired or token version)",
            });
        } else {
          return res.status(401).json({ message: "Unauthorized", error: err });
        }
      } 

      req.user = payload;
      next();
    });
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized', error: e });
  }
}

export default authGuard;















/*export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let id: any;
  let type: any;
  let tokenVersion: any;
  const authheader = req.headers.authorization;
  const token = authheader && authheader.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "no token found" });
     
  const decoded = jwt.decode(token!);
  if (typeof decoded === 'object' && decoded !== null) {
    id = decoded!.id;
    type = decoded!.type;
    tokenVersion = decoded!.tokenVersion;
    console.log("authguard tokenVersion", tokenVersion);
  }


  jwt.verify(token!, process.env.secret_key as string, async (err: any, user: any) => {

    const userfound = await findUserById(req, res, type, id);
    
    if (err && err.name === "TokenExpiredError") {
      userfound.online = false;
      userfound.token = "";
      userfound.tokenVersion += 1;
      await userfound.save();
      return res.status(401).json({ message: "loged out succesfully (token expired)" });
    } else if (userfound.tokenVersion !== tokenVersion) {
      console.log("user.tokenVersion", user.tokenVersion);
      console.log("tokenVersion", tokenVersion);
      return res.send("token version not matched");
    }
    else if(err) {
        return res.status(401).json({ message: "Unauthorized", err: err });
    }
    
      req.user = user;
        next();
    });
}*/










/*const authGuard = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token found' });

  try {
    let id: any;
    let type: any;
    const payload = jwt.verify(token, process.env.secret_key!) as jwt.JwtPayload;
    id = payload!.id;
    type = payload!.type;

    req.user = await findUserById(req, res, type, id);
    next();

  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!refreshToken) return res.status(401).json({ message: 'No refresh token found' });

      const payload = jwt.verify(refreshToken, process.env.refresh_secret_key!) as jwt.JwtPayload;

      // Get user
      const user = await findUserById(req, res, payload.type, payload.id);

      // Check if refresh token in request matches stored refresh token
      if (refreshToken !== user.refreshToken) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      // Create new access and refresh tokens
      const newAccessToken = jwt.sign({ id: user.id }, process.env.secret_key!, { expiresIn: '1d' });
      const newRefreshToken = jwt.sign({ id: user.id }, process.env.refresh_secret_key!, { expiresIn: '7d' });

      // Update refresh token in user model
      user.refreshToken = newRefreshToken;
      await user.save();

      // Send new tokens to client
      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } else {
      res.status(401).json({ message: 'Unauthorized', error: e});
    }
  }
};
*/
























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









































  
