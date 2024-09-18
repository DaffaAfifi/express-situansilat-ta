import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import db from "../application/database.js";
import bcrypt from "bcrypt";
import { response } from "../response/response.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const register = async (req, res) => {
  try {
    const user = validate(registerUserValidation, req);

    const [countUser] = await db
      .promise()
      .query("SELECT COUNT(*) AS count FROM users WHERE username = ?", [
        user.username,
      ]);

    if (countUser.count > 0) {
      return response(400, null, "Username already exists", res);
    }

    user.password = await bcrypt.hash(user.password, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, password, NIK, alamat, telepon, jenis_kelamin, kepala_keluarga, tempat_lahir, tanggal_lahir, jenis_usaha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          user.name,
          user.email,
          user.password,
          user.NIK,
          user.alamat,
          user.telepon,
          user.jenis_kelamin,
          user.kepala_keluarga,
          user.tempat_lahir,
          user.tanggal_lahir,
          user.jenis_usaha,
        ]
      );

    response(201, result, "User created", res);
  } catch (error) {
    response(
      error.status || 500,
      null,
      `Error during registration: ${error.message}`,
      res
    );
  }
};

const login = async (req, res) => {
  try {
    const loginRequest = validate(loginUserValidation, req);

    const [rows] = await db
      .promise()
      .query("SELECT id, username, password FROM users WHERE username = ?", [
        loginRequest.username,
      ]);

    if (rows.length === 0) {
      return response(401, null, "Username or password wrong", res);
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password
    );

    if (!isPasswordValid) {
      return response(401, null, "Username or password wrong", res);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await db
      .promise()
      .query("INSERT INTO sessions (token, email, expiry) VALUES (?, ?, ?)", [
        token,
        user.email,
        new Date(Date.now() + 3600000),
      ]);

    // Return the token as a response
    response(200, { token }, "Login successful", res);
  } catch (error) {
    response(
      error.status || 500,
      null,
      `Error during login: ${error.message}`,
      res
    );
  }
};

export { register, login };
