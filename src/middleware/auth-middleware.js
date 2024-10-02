import db from "../application/database.js";
import { ResponseError } from "../response/response-error.js";
import jwt from "jsonwebtoken";
import { logger } from "../application/logging.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return next(new ResponseError(401, "Unauthorized"));
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM sessions WHERE token = ?", [token]);

    if (rows.length === 0) {
      return next(new ResponseError(401, "Unauthorized"));
    }

    const decodedToken = jwt.decode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      await db.promise().query("DELETE FROM sessions WHERE token = ?", [token]);
      return next(new ResponseError(401, "Unauthorized"));
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(new ResponseError(500, error.message));
  }
};
