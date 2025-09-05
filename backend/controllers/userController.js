import Task from "../models/Task.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// desc get all users(admin only)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");
    // add task counts to each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "in-progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
        });
        return { ...user._doc, pendingTasks, inProgressTasks, completedTasks };
      })
    );
    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// desc get all user by id (admin only)
// @route GET /api/users/:id`
// @access Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "user not found" });
        res.json(user);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export { getUsers, getUserById };
