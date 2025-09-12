import React from "react";
import Progress from "../layouts/Progress";
import AvatarGroup from "../layouts/AvatarGroup";
import { LucidePaperclip } from "lucide-react";
import moment from "moment";

const TaskCard = ({
  title,
  description,
  assignedTo,
  dueDate,
  priority,
  status,
  createdAt,
  attachmentCount,
  todoChecklist,
  progress,
  completedTodoCount,
  onClick,
}) => {
//   console.log("Attachment Count:", attachmentCount); // <-- Add this line to debug
  const getStatusTagColor = () => {
    switch (status) {
      case "completed":
        return "bg-lime-100 text-lime-800 border border-lime-500/20 ";
      case "in Progress":
        return "bg-cyan-100 text-cyan-800 border border-cyan-500/20 ";
      default:
        return "bg-violet-100 text-violet-800 border border-violet-500/20 ";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "low":
        return "bg-emerald-100 text-emerald-800 border border-emerald-500/20 ";
      case "medium":
        return "bg-amber-100 text-amber-800 border border-amber-500/20 ";
      default:
        return "bg-rose-100 text-rose-800 border border-rose-500/20 ";
    }
  };
  return (
    <div
      className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
      onClick={onClick}
    >
      <div className=" flex items-end gap-3 px-4  ">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded `}
        >
          {status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded mt-1`}
        >
          {priority} Priority
        </div>
      </div>
      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "completed"
            ? "border-indigo-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-sm text-gray-600 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>
        <p className="text-[13px] text-gray-700/80 mt-2 mb-2 font-medium leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>
        <Progress progress={progress} status={status} />
      </div>
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("Do MMM YYYY")}
            </p>
          </div>
          <div className="">
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("Do MMM YYYY")}
              
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup avatars={assignedTo || []} />
          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LucidePaperclip className="text-blue-500 w-4 h-4" />{" "}
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
