import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AvatarGroup from "../../components/layouts/AvatarGroup";
import moment from "moment";
import { LucideSquareArrowOutUpRight } from "lucide-react";
// import TodoCheckList from "../../components/Inputs/TodoCheckList";
const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "inprogress":
        return "bg-cyan-50 text-cyan-500 border border-cyan-500/20 ";
      case "completed":
        return "bg-green-50 text-green-500 border border-green-500/20 ";
      default:
        return "bg-violet-50 text-violet-500 border border-violet-500/20";
    }
  };

  // get task info by id
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.TASKS.GET_TASK_BY_ID(id)
      );
      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  // HANDLE TODO CHECKLIST
  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...task.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      try {
        const response = await axiosInstance.put(
          API_ENDPOINTS.TASKS.UPDATE_TASK_CHECKLIST(taskId),
          { todoChecklist }
        );
        
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        console.error("Error updating todo checklist:", error);
       
      }
      
    }
  };

  //const handle attachmemnt link click
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link;
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    return () => {};
  }, [id]);

  return (
    <DashboardLayout activeMenu="My Task">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4 ">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {" "}
                  {task?.title}
                </h2>
                <div
                  className={`text-[11px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded`}
                >
                  {task?.status}
                </div>
              </div>
              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("YYYY-MM-DD")
                        : null
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>
                  <AvatarGroup
                    avatars={
                      task?.assignedTo?.map((item) => item.profileImageUrl) ||
                      []
                    }
                    maxVisible={5}
                  />
                </div>
              </div>
              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>
                {task?.todoChecklist?.map((item, index) => (
                  <TodoCheckList
                    key={`todo_${index}`}
                    text={item.text}
                    isChecked={item?.completed}
                    onChange={() => updateTodoChecklist(index)}
                  />
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>
                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[12px] text-gray-600">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 cursor-pointer "
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3 border-r border-gray-100">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1} ` : index + 1}
        </span>
        <p className="text-xs text-black">{link}</p>
      </div>
      <LucideSquareArrowOutUpRight className="text-gray-400 w-4 h-4" />
    </div>
  );
};
