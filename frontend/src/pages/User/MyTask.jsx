import React from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import { LucideFileSpreadsheet } from "lucide-react";
import TaskStatusTabs from "../../components/layouts/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const navigate = useNavigate();
  const getAllTasks = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.TASKS.GET_ALL_TASKS,
        {
          params: {
            status: filterStatus === "All" ? "" : filterStatus.toLowerCase(),
          },
        }
      );

      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);
      //map statusSummary data with fixed labels
      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0 },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/user/taskdetail/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <div>
      <DashboardLayout activeMenu="MyTask">
        <div className="my-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between ">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl md:text-xl font-medium"> Manage Task</h2>
            </div>

            {tabs?.[0]?.count > 0 && (
              <div className="flex items-center gap-3">
                <TaskStatusTabs
                  tabs={tabs}
                  setActiveTab={setFilterStatus}
                  activeTab={filterStatus}
                />
                
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4">
            {allTasks?.map((item, index) => (
              <TaskCard
                key={item._id}
                title={item.title}
                description={item.description}
                status={item.status}
                createdAt={item.createdAt}
                priority={item.priority}
                progress={item.progress}
                assignedTo={item.assignedTo?.map(
                  (item) => item.profileImageUrl
                )}
                dueDate={item.dueDate}
                attachmentCount={item.attachments?.length || 0}
                completedTodoCount={item.completedTodoCount || 0}
                todoChecklist={item.todoChecklist || []}
                onClick={() => {
                  handleClick(item._id);
                }}
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};
export default MyTask;
