import Task from "../models/Task.js";
import User from "../models/User.js";
import excelJS from "exceljs";

//@desc export all tasks as an excel file
//@route GET/api/reports/export/tasks

const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find().select("_id name email").lean();
    const userTasks = await Task.find().populate("assignedTo", "name email");
    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });
    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "in progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });
      
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet("Users Task Report");
      worksheet.columns = [
          { header: "User Name", key: "name", width: 30 },
          { header: "User Email", key: "email", width: 30 },
          { header: "Total Assigned Tasks", key: "taskCount", width: 15 },
          { header: "Pending Tasks", key: "pendingTasks", width: 15 },
          { header: "In Progress Tasks", key: "inProgressTasks", width: 15 },
          { header: "Completed Tasks", key: "completedTasks", width: 15 },
      ];



      Object.values(userTaskMap).forEach((user) => {
        worksheet.addRow(user);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", "attachment; filename=users_report.xlsx");

      return workbook.xlsx.write(res).then(() => {
        res.end();
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//@desc export all users as an excel file
//@route GET/api/reports/export/users

const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 30 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 30 },
      { header: "Status", key: "status", width: 30 },
      { header: "Assigned To", key: "assignedTo", width: 30 },
      { header: "Due Date", key: "dueDate", width: 30 },
      { header: "Priority", key: "priority", width: 30 },
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");
      worksheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
        assignedTo: assignedTo || "Unassigned",
        dueDate: task.dueDate.toISOString().split("T")[0],
        priority: task.priority,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tasks.xlsx");

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { exportTasksReport, exportUsersReport };
