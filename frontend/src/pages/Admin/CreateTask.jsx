import React, { useEffect, useState } from "react";
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
import TodoCheckList from "../../components/Inputs/TodoCheckList";
import FileUpload from "../../components/Inputs/FileUpload";
import Modal from "../../components/layouts/Modal";
import DeleteAlert from "../../components/layouts/DeleteAlert";

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

  const handleValueChange = (key, value) => {
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
  const createTask = async () => {
    setLoading(true);
    try {
      const todolist = tasKData.todoChecklist?.map((item) => ({
        text: item,
        completed: false,
      }));
      const response = await axiosInstance.post(
        API_ENDPOINTS.TASKS.CREATE_TASK,
        {
          ...tasKData,
          dueDate: new Date(tasKData.dueDate).toISOString(),
          todoChecklist: todolist,
        }
      );
      toast.success("Task created successfully");
      clearData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //update task
  const updateTask = async () => {
    setLoading(true);
    try {
      const todolist = tasKData.todoChecklist?.map((item) => {
        const prevTodoChecklist = currentTask?.todoChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text == item);
        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const response = await axiosInstance.put(
        API_ENDPOINTS.TASKS.UPDATE_TASK(taskId),
        {
          ...tasKData,
          dueDate: new Date(tasKData.dueDate).toISOString(),
          todoChecklist: todolist,
        }
      );
      toast.success("Task updated successfully");
      clearData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //delete task
  const deleteTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_ENDPOINTS.TASKS.DELETE_TASK(taskId));
      setOpenDeleteAlert(false);
      toast.success("Task deleted successfully");
      navigate("/admin/tasks");
      clearData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  //get task details
  const getTaskDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.TASKS.GET_TASK_BY_ID(taskId)
      );
      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item.text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById(taskId);
    }
    return () => {};
  }, [taskId]);

  const handleSubmit = async () => {
    setError(null);
    //input validation
    if (!tasKData.title.trim()) {
      setError("Task title is required");
      return;
    }
    if (!tasKData.description.trim()) {
      setError("Task description is required");
      return;
    }
    if (!tasKData.dueDate) {
      setError("Task due date is required");
      return;
    }
    if (!tasKData.assignedTo?.length === 0) {
      setError("Task assigned to is required");
      return;
    }
    if (!tasKData.todoChecklist?.length === 0) {
      setError("Add at least one task");
      return;
    }

    if (taskId) {
      updateTask();
      return;
    }
    createTask();
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className=" flex gap-2 items-center text-red-500 bg-red-100 border rounded-lg py-2 px-2 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LucideTrash className="text-base text-rose-500 w-4 h-4" />{" "}
                  Delete
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
                  onChange={(value ) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label> 
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
                  selectedUsers={tasKData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>
            <div className=" mt-3">
              <label className="text-xs font-medium text-slate-600">
                Todo Checklist
              </label>
              <TodoCheckList
                todoChecklist={tasKData?.todoChecklist}
                setTodoChecklist={(value) =>
                  handleValueChange("todoChecklist", value)
                }
              />
            </div>
            <div className=" mt-3">
              <label className="text-xs font-medium text-slate-600">
                Attachments
              </label>
              <FileUpload
                attachments={tasKData?.attachments}
                setAttachments={(value) =>
                  handleValueChange("attachments", value)
                }
              />
            </div>

            {error && <p className="text-xs text-rose-500 mt-5">{error}</p>}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Delete Task"
      >
        <DeleteAlert
          content="Are you sure you want to delete this task?"
          onDelete={() => deleteTask()}
        />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
