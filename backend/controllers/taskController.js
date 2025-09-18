import Task from "../models/Task.js";

//@desc get all tasks
//@route GET /api/tasks
//@access Private

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = { organizationToken: req.user.organizationToken }; // ✅ enforce org isolation

    if (status) {
      filter.status = status;
    }

    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({
        ...filter,
        assignedTo: req.user._id,
      }).populate("assignedTo", "name email profileImageUrl");
    }

    // add completed todochecklist count
    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    // status summary counts
    const allTasks = await Task.countDocuments(filter);

    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "inProgress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc get task by id
//@route GET /api/tasks/:id
//@access Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationToken: req.user.organizationToken, // ✅ scoped
    }).populate("assignedTo", "name email profileImageUrl");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc create new task (admin)
//@route POST /api/tasks
//@access Private
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assignedTo,
      dueDate,
      attachments,
      todoChecklist,
    } = req.body;

    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      attachments,
      dueDate,
      createdBy: req.user._id,
      todoChecklist,
      organizationToken: req.user.organizationToken, // ✅ add org token
    });

    res.status(201).json({ message: "task created", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//@desc update task
//@route PUT /api/tasks/:id
//@access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationToken: req.user.organizationToken, // ✅ scoped
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.attachments = req.body.attachments || task.attachments;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    res.json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc update task status
//@route PUT /api/tasks/:id/status
//@access Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationToken: req.user.organizationToken, // ✅ scoped
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.status = req.body.status || task.status;

    if (task.status === "completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }

    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc delete task
//@route DELETE /api/tasks/:id
//@access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      organizationToken: req.user.organizationToken, // ✅ scoped
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc update task checklist
//@route PUT /api/tasks/:id/checklist
//@access Private
const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      organizationToken: req.user.organizationToken, // ✅ scoped
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    task.todoChecklist = todoChecklist;

    // auto-update progress
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "completed";
    } else if (task.progress > 0) {
      task.status = "inProgress";
    } else {
      task.status = "pending";
    }

    await task.save();

    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );

    res.json({ message: "Task checklist updated", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc get dashboard data
//@route GET /api/tasks/dashboard
//@access Private
const getDashboardData = async (req, res) => {
  try {
    const orgFilter = { organizationToken: req.user.organizationToken }; // ✅ scoped

    const totalTasks = await Task.countDocuments(orgFilter);
    const completedTasks = await Task.countDocuments({
      ...orgFilter,
      status: "completed",
    });
    const pendingTasks = await Task.countDocuments({
      ...orgFilter,
      status: "pending",
    });
    const overdueTasks = await Task.countDocuments({
      ...orgFilter,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["pending", "inProgress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: orgFilter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["all"] = totalTasks;

    const taskPriorities = ["low", "medium", "high"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: orgFilter },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find(orgFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, completedTasks, pendingTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//@desc get user dashboard data
//@route GET /api/tasks/dashboard/user
//@access Private
const getUserDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const orgFilter = { organizationToken: req.user.organizationToken }; // ✅ scoped

    const totalTasks = await Task.countDocuments({
      ...orgFilter,
      assignedTo: userId,
    });
    const completedTasks = await Task.countDocuments({
      ...orgFilter,
      assignedTo: userId,
      status: "completed",
    });
    const pendingTasks = await Task.countDocuments({
      ...orgFilter,
      assignedTo: userId,
      status: "pending",
    });
    const overdueTasks = await Task.countDocuments({
      ...orgFilter,
      assignedTo: userId,
      status: { $ne: "completed" },
      dueDate: { $lt: new Date() },
    });

    const taskStatuses = ["pending", "inProgress", "completed"];
    const taskDistributionRaw = await Task.aggregate([
      { $match: { ...orgFilter, assignedTo: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      acc[status] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
    }, {});
    taskDistribution["all"] = totalTasks;

    const taskPriorities = ["low", "medium", "high"];
    const taskPriorityLevelsRaw = await Task.aggregate([
      { $match: { ...orgFilter, assignedTo: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
      acc[priority] =
        taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    const recentTasks = await Task.find({
      ...orgFilter,
      assignedTo: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: { totalTasks, completedTasks, pendingTasks, overdueTasks },
      charts: { taskDistribution, taskPriorityLevels },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  updateTaskChecklist,
  getDashboardData,
  getUserDashboardData,
};
