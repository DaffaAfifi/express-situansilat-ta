import {
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import db from "../application/database.js";
import bcrypt from "bcrypt";
import { ResponseError } from "../response/response-error.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { logger } from "../application/logging.js";

// Register or create user
const register = async (req, res) => {
  try {
    const user = validate(registerUserValidation, req);

    const [countUser] = await db
      .promise()
      .query("SELECT COUNT(*) AS count FROM users WHERE email = ? OR NIK = ?", [
        user.email,
        user.NIK,
      ]);

    if (countUser[0].count > 0) {
      throw new ResponseError(400, "Email or NIK already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (nama, email, password, NIK, alamat, telepon, jenis_kelamin, kepala_keluarga, tempat_lahir, tanggal_lahir, jenis_usaha, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          user.nama,
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
          new Date(),
          new Date(),
        ]
      );

    return result;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

// Login
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

// Get all users
const getUsers = async () => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT nama, email, NIK, alamat, telepon, jenis_kelamin, kepala_keluarga, tempat_lahir, tanggal_lahir, jenis_usaha FROM users"
      );

    const modifiedRows = rows.map((row) => ({
      ...row,
      jenis_kelamin: row.jenis_kelamin === "L" ? "Laki-Laki" : "Perempuan",
      kepala_keluarga:
        row.kepala_keluarga === 1 ? "Kepala Keluarga" : "Bukan Kepala Keluarga",
      tanggal_lahir: new Date(row.tanggal_lahir).toLocaleDateString("en-GB"),
    }));

    return modifiedRows;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

// Get user by id
const getUserById = async (id) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT nama, email, NIK, alamat, telepon, jenis_kelamin, kepala_keluarga, tempat_lahir, tanggal_lahir, jenis_usaha FROM users WHERE id = ?",
        [id]
      );

    const modifiedRows = rows.map((row) => ({
      ...row,
      jenis_kelamin: row.jenis_kelamin === "L" ? "Laki-Laki" : "Perempuan",
      kepala_keluarga:
        row.kepala_keluarga === 1 ? "Kepala Keluarga" : "Bukan Kepala Keluarga",
      tanggal_lahir: new Date(row.tanggal_lahir).toLocaleDateString("en-GB"),
    }));

    return modifiedRows[0];
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

// Get user saved news
const getSavedNews = async (id) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
          users.id, users.nama, users.email, users.NIK, users.alamat, users.telepon, 
          users.jenis_kelamin, users.kepala_keluarga, users.tempat_lahir, users.tanggal_lahir, 
          users.jenis_usaha, news.id AS news_id, news.gambar, news.judul, news.subjudul, news.isi, news.created_at 
        FROM users 
        INNER JOIN saved_news ON users.id = saved_news.user_id 
        INNER JOIN news ON saved_news.news_id = news.id 
        WHERE users.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      throw new ResponseError(404, "User or saved news not found");
    }

    const user = rows[0];

    const payload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      NIK: user.NIK,
      alamat: user.alamat,
      telepon: user.telepon,
      jenis_kelamin: user.jenis_kelamin === "L" ? "Male" : "Female",
      kepala_keluarga:
        user.kepala_keluarga === 1
          ? "Kepala Keluarga"
          : "Bukan Kepala Keluarga",
      tempat_lahir: user.tempat_lahir,
      tanggal_lahir: new Date(user.tanggal_lahir).toLocaleDateString("en-GB"),
      jenis_usaha: user.jenis_usaha,
      berita_tersimpan: rows.map((row) => ({
        id: row.news_id,
        gambar: row.gambar,
        judul: row.judul,
        subjudul: row.subjudul,
        isi: row.isi,
        created_at: new Date(row.created_at).toLocaleDateString("en-GB"),
      })),
    };

    return payload;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

// Get user facilities
const getFacilities = async (id) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT
          users.id, users.email, users.NIK, users.alamat, users.telepon, users.jenis_kelamin, users.kepala_keluarga, users.tempat_lahir, users.tanggal_lahir, users.jenis_usaha,
          sertificates.id AS id_sertifikat, sertificates.nama AS nama_sertifikat, user_sertificates.no_sertifikat, sertificates.tanggal_terbit, sertificates.kadaluarsa, sertificates.keterangan,
          trainings.id AS id_pelatihan, trainings.nama AS nama_pelatihan, trainings.penyelenggara, trainings.tanggal_pelaksanaan, trainings.tempat,
          assistance.id AS id_bantuan, assistance.nama AS nama_bantuan, assistance.koordinator, assistance.sumber_anggaran, assistance.total_anggaran, assistance.tahun_pemberian,
          tools.id AS id_alat, tools.nama_item, tools.harga, tools.deskripsi
        FROM users
        LEFT JOIN user_sertificates ON users.id = user_sertificates.user_id
        LEFT JOIN sertificates ON user_sertificates.sertificates_id = sertificates.id
        LEFT JOIN user_trainings ON users.id = user_trainings.user_id
        LEFT JOIN trainings ON user_trainings.trainings_id = trainings.id
        LEFT JOIN assistance ON users.id = assistance.user_id
        LEFT JOIN assistance_tools ON assistance.id = assistance_tools.assistance_id
        LEFT JOIN tools ON assistance_tools.tools_id = tools.id
        WHERE users.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      throw new ResponseError(404, "User or facilities not found");
    }

    const result = {
      id: rows[0].id,
      nama: rows[0].nama,
      email: rows[0].email,
      NIK: rows[0].NIK,
      alamat: rows[0].alamat,
      telepon: rows[0].telepon,
      jenis_kelamin: rows[0].jenis_kelamin,
      kepala_keluarga: rows[0].kepala_keluarga,
      tempat_lahir: rows[0].tempat_lahir,
      tanggal_lahir: rows[0].tanggal_lahir,
      jenis_usaha: rows[0].jenis_usaha,
      sertifikat: [],
      pelatihan: [],
      bantuan: [],
    };

    const helpMap = {};

    rows.forEach((row) => {
      if (
        row.id_sertifikat &&
        !result.sertifikat.some((c) => c.id === row.id_sertifikat)
      ) {
        result.sertifikat.push({
          id: row.id_sertifikat,
          nama: row.nama_sertifikat,
          no_sertifikat: row.no_sertifikat,
          tanggal_terbit: row.tanggal_terbit,
          kadaluarsa: row.kadaluarsa,
          keterangan: row.keterangan,
        });
      }

      if (
        row.id_pelatihan &&
        !result.pelatihan.some((t) => t.id === row.id_pelatihan)
      ) {
        result.pelatihan.push({
          id: row.id_pelatihan,
          nama: row.nama_pelatihan,
          koordinator: row.penyelenggara,
          tanggal_pelaksanaan: row.tanggal_pelaksanaan,
          tempat: row.tempat,
        });
      }

      if (row.id_bantuan) {
        if (!helpMap[row.id_bantuan]) {
          helpMap[row.id_bantuan] = {
            id: row.id_bantuan,
            nama: row.nama_bantuan,
            koordinator: row.koordinator,
            sumber_anggaran: row.sumber_anggaran,
            tahun_pemberian: row.tahun_pemberian,
            total_anggaran: row.total_anggaran,
            alat: [],
          };
        }
        if (
          row.id_alat &&
          !helpMap[row.id_bantuan].alat.some((tool) => tool.id === row.id_alat)
        ) {
          helpMap[row.id_bantuan].alat.push({
            id: row.id_alat,
            nama: row.nama_item,
            harga: row.harga,
          });
        }
      }
    });

    result.bantuan = Object.values(helpMap);

    return result;
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
};

// Update user
const updateUser = async (id, data) => {
  const user = validate(updateUserValidation, data);

  try {
    const result = await db
      .promise()
      .query("UPDATE users SET ? WHERE id = ?", [user, id]);
    return result;
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
  register,
  login,
  getUsers,
  getUserById,
  getSavedNews,
  getFacilities,
  updateUser,
  logout,
};
