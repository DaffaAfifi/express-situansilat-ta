import db from "../application/database.js";
import { ResponseError } from "../response/response-error.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return next(new ResponseError(401, "Unauthorized"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;

    const [rows] = await db
      .promise()
      .query("SELECT * FROM sessions WHERE token = ?", [token]);

    if (rows.length === 0) {
      return next(new ResponseError(401, "Unauthorized"));
    }

    next();
  } catch (error) {
    return next(new ResponseError(401, "Unauthorized"));
  }
};
