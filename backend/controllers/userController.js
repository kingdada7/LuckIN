import Task from "../models/Task.js";
import User from "../models/User.js";

// desc get all users (admin only, scoped by org)
// @route GET /api/users
// @access Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "member",
      organizationToken: req.user.organizationToken, // ✅ only same org
    }).select("-password");

    // add task counts scoped to org
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "pending",
          organizationToken: req.user.organizationToken, // ✅ scope
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "inProgress",
          organizationToken: req.user.organizationToken, // ✅ scope
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "completed",
          organizationToken: req.user.organizationToken, // ✅ scope
        });

        return { ...user._doc, pendingTasks, inProgressTasks, completedTasks };
      })
    );

    res.json(usersWithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// desc get user by id (admin only, scoped by org)
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      organizationToken: req.user.organizationToken, // ✅ ensure same org
    }).select("-password");

    if (!user) return res.status(404).json({ message: "user not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export { getUsers, getUserById };
