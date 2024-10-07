import express from "express";
import authController from "../controller/auth-controller.js";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
publicRouter.get("/api/test-connection", userController.test);

// Auth API
publicRouter.post("/api/users/login", authController.login); // Login -> mid

export { publicRouter };
