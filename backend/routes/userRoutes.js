import express from "express"
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {  getUserById, getUsers } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/", protect, adminOnly, getUsers);// get all users
userRoutes.get("/:id", protect, adminOnly, getUserById);// get user by id




export default userRoutes;
