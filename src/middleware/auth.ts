import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { get } from "lodash";
import jwt from "jsonwebtoken";
import User from "../models/user";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE as string,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL as string,
  tokenSigningAlg: "RS256"
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

  if (!token) {
    return res.sendStatus(401);
  }

  //Bearer lsjsjdkjksjaks

  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;

    console.log("DECODE::::", decoded);

    const auth0Id = decoded.sub;

    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res.sendStatus(401);
    }

    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    return res.sendStatus(401);
  }
};
