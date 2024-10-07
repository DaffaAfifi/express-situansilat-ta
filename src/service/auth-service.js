import { loginUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import db from "../application/database.js";
import bcrypt from "bcrypt";
import { ResponseError } from "../response/response-error.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { logger } from "../application/logging.js";

// Login user
const login = async (req) => {
  try {
    const loginRequest = validate(loginUserValidation, req);

    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [loginRequest.email]);

    if (rows.length === 0) {
      throw new ResponseError(400, "Username or password wrong");
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ResponseError(400, "Username or password wrong");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, nama: user.nama, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    await db
      .promise()
      .query(
        "INSERT INTO sessions (token, email, expiry, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        [
          token,
          user.email,
          new Date(Date.now() + 7200000),
          new Date(),
          new Date(),
        ]
      );

    return token;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

// Logout user
const logout = async (token) => {
  try {
    const result = await db
      .promise()
      .query("DELETE FROM sessions WHERE token = ?", [token]);
    return result;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

export default {
  login,
  logout,
};
