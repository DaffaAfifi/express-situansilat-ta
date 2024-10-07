import userService from "../service/user-service.js";
import { response } from "../response/response.js";
import { logger } from "../application/logging.js";
import jwt from "jsonwebtoken";

const test = async (req, res, next) => {
  try {
    res.status(200).json({
      data: "test",
    });
  } catch (error) {
    next(error);
  }
};

const testToken = (req, res, next) => {
  try {
    const token = req.get("Authorization");
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    res.status(200).json({
      data: decoded,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers();
    response(200, result, "Get users success", res);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const result = await userService.createUser(req.body);
    response(200, result, "Register success", res);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const result = await userService.getUserById(req.params.id);
    response(200, result, "Get user success", res);
  } catch (error) {
    next(error);
  }
};

const getSavedNews = async (req, res, next) => {
  try {
    const result = await userService.getSavedNews(req.params.id);
    response(200, result, "Get saved news success", res);
  } catch (error) {
    next(error);
  }
};

const getFacilities = async (req, res, next) => {
  try {
    const result = await userService.getFacilities(req.params.id);
    response(200, result, "Get facilities success", res);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    response(200, result, "Update user success", res);
  } catch (error) {
    next(error);
  }
};

const getSavedNewsComment = async (req, res, next) => {
  try {
    const result = await userService.getSavedNewsComment(req.params.id);
    response(200, result, "Get saved news comment success", res);
  } catch (error) {
    next(error);
  }
};

export default {
  test,
  getUsers,
  createUser,
  getUserById,
  getSavedNews,
  getFacilities,
  updateUser,
  getSavedNewsComment,
  testToken,
};
