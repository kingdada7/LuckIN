import { adminOnly, protect } from "../middleware/authMiddleware.js";
import express from "express";

import {
  getTasks,
  getDashboardData,
  getUserDashboardData,
  getTaskById,
  createTask,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

// task management routes
taskRouter.get("/dashboard-data", protect, getDashboardData);
taskRouter.get("/user-dashboard-data", protect, getUserDashboardData);
taskRouter.get("/", protect, getTasks); //get task (admin:all,user: assigned)
taskRouter.get("/:id", protect, getTaskById); //get task by id (admin:all,user: assigned)
taskRouter.post("/", protect, adminOnly, createTask); //create task (admin:all,user: assigned)
taskRouter.put("/:id", protect, updateTask); //update task (admin:all,user: assigned)
taskRouter.put("/:id/status", protect, updateTaskStatus); //update task (admin:all,user: assigned)
taskRouter.put("/:id/todo", protect, updateTaskChecklist); //update task (admin:all,user: assigned)
taskRouter.delete("/:id", protect, deleteTask); //delete task (admin:all,user: assigned)

export default taskRouter;
