import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/test-token", userController.testToken);
userRouter.get("/api/users", userController.getUsers);
userRouter.get("/api/users/:id", userController.getUserById);
userRouter.get("/api/users/saved-news/:id", userController.getSavedNews);
userRouter.get("/api/users/facilities/:id", userController.getFacilities);
userRouter.put("/api/users/:id", userController.updateUser);
userRouter.post("/api/logout", userController.logout);

export { userRouter };
