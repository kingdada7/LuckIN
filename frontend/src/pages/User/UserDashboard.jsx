

import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router";
import { API_ENDPOINTS } from "../../utils/apiPaths.js";
import axiosInstance from "../../utils/axiosInstance.js";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper.js";
import InfoCard from "../../components/Cards/InfoCard.jsx";
import { LucideArrowRight } from "lucide-react";
import { TaskListTable } from "../../components/layouts/TaskListTable.jsx";
import CustomPieChart from "../../components/Charts/CustomPieChart.jsx";
import CustomBarChart from "../../components/Charts/CustomBarChart.jsx";

const COLORS = ["#8D51FF", "#0088DB", "#7BCE00"];

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  //prepare chart data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;
    const taskDistributionData = [
      { status: "pending", count: taskDistribution?.pending || 0 },
      { status: "inProgress", count: taskDistribution?.inProgress || 0 },
      { status: "completed", count: taskDistribution?.completed || 0 },
    ];
    setPieChartData(taskDistributionData);
    const PriorityLevelData = [
      { priority: "high", count: taskPriorityLevels?.high || 0 },
      { priority: "medium", count: taskPriorityLevels?.medium || 0 },
      { priority: "low", count: taskPriorityLevels?.low || 0 },
    ];
    setBarChartData(PriorityLevelData);
  };

  const getdashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.TASKS.GET_USER_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };
  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getdashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className="col-span-3">
          <h2 className="text-xl md:text-2xl">Good Day {user?.name}</h2>
          <p className="text-xs md:text-[13px]text-gray-400 mt-1.5 ">
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-5">
          <InfoCard
            label="TotalTasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.all || 0
            )}
            color="bg-blue-500"
          />
          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.pending || 0
            )}
            color="bg-violet-500"
          />
          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.inProgress || 0
            )}
            color="bg-cyan-500"
          />
          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.charts?.taskDistribution?.completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 md:my-6">
        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5>Task Distribution</h5>
            </div>
            <CustomPieChart
              data={pieChartData}
              label="Task Distribution"
              colors={COLORS}
            />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between">
              <h5>Task Distribution</h5>
            </div>
            <CustomBarChart
              data={barChartData}
              label="Task Distribution"
              colors={COLORS}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Tasks</h5>
              <button className="card-btn" onClick={onSeeMore}>
                See More <LucideArrowRight className="text-base" />
              </button>
            </div>
            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
