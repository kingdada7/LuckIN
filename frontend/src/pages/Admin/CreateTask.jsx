import React, { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import moment from "moment";
import { LucideTrash } from "lucide-react";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";


const CreateTask = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = location.state || {};

  const [tasKData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (e) => {
    const { key, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };
  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };
  //create task
  const createTask = async () => {};

  //update task
  const updateTask = async () => {};

  //delete task

  //get task details
  const getTaskDetailsById = async () => {};

  const handleSubmit = async () => {};

  return (
    <div>
      <DashboardLayout activeMenu="Create Task">
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-xl font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer">
                  {taskId ? "Update Task" : "Create Task"}
                </h2>
                {taskId && (
                  <button className="" onClick={() => setOpenDeleteAlert(true)}>
                    <LucideTrash className="text-base" /> Delete
                  </button>
                )}
              </div>
              <div className="mt-4">
                <label className="text-xs font-medium text-slate-600">
                  Task Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={tasKData.title}
                  onChange={({ target }) =>
                    handleValueChange("title", target.value)
                  }
                  name="title"
                  placeholder="create app ui"
                />
              </div>
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Task Description
                </label>
                <textarea
                  className="form-input"
                  value={tasKData.description}
                  onChange={({ target }) =>
                    handleValueChange("description", target.value)
                  }
                  name="description"
                  placeholder="decribe task"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-6 md:col-span-4">
                  <label>priority</label>
                  <SelectDropdown
                    options={PRIORITY_DATA}
                    value={tasKData.priority}
                    onChange={({ value }) =>
                      handleValueChange("priority", value)
                    }
                    placeholder="Select Priority"
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">Due Date</label>
                  <input
                    type="date"
                    placeholder="Due Date"
                    className="form-input"
                    value={tasKData.dueDate}
                    onChange={({ target }) =>
                      handleValueChange("dueDate", target.value)
                    }
                    name="dueDate"
                  />
                </div>
                <div className="col-span-12 md:col-span-4">
                  <label className="text-xs font-medium text-slate-600">
                    Assigned To
                  </label>
                  <SelectUsers
                    SelectUsers={tasKData.assignedTo}
                    setSelectedUsers={(value) =>
                      handleValueChange("assignedTo", value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default CreateTask;
