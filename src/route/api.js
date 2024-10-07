import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import authController from "../controller/auth-controller.js";
import userController from "../controller/user-controller.js";
import newsController from "../controller/news-controller.js";
import assistanceController from "../controller/assistance-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/test-token", userController.testToken);

// Users API
userRouter.get("/api/users", userController.getUsers); // Get all users - low
userRouter.post("/api/users", userController.createUser); // Ceate user - low
userRouter.put("/api/users/:id", userController.updateUser); // Update user - low
userRouter.get("/api/users/:id", userController.getUserById); // Get user by id - low
userRouter.get("/api/users/saved-news/:id", userController.getSavedNews); // Get user saved news - mid
userRouter.get("/api/users/facilities/:id", userController.getFacilities); // Get user facilities(sertficate, training, assistance) - high
userRouter.get(
  "/api/users/saved-news/comment/:id",
  userController.getSavedNewsComment
); // Get user saved news comment - high

// News API
userRouter.get("/api/news/:id", newsController.getNewsCommentsById); // Get news & comment by id - mid

// Assistance API
userRouter.get("/api/assistance/:id", assistanceController.getAssistanceById); // Get assistance & tools by id - mid
userRouter.post(
  "/api/assistance-tools",
  assistanceController.createAssistanceTools
); // Create assistance tools trigger total harga - high

// Logout
userRouter.post("/api/logout", authController.logout); // Logout - low

export { userRouter };
