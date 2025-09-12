import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_ENDPOINTS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { LucideFileSpreadsheet } from "lucide-react";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  // download task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.REPORTS.EXPORT_USERS,{
          responseType: "blob",
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Error downloading report");
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-semibold">Team Members</h2>
          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LucideFileSpreadsheet className="text-lg w-4 h-4" /> Download
            Report
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers.map((user) => (
            <UserCard
              key={user._id}
              userInfo={user}
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
            />
              
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUser;
