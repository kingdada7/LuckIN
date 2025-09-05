import React, { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

import CreateTask from "./pages/Admin/CreateTask";
import ManageUser from "./pages/Admin/ManageUser";
import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import ManageTask from "./pages/Admin/ManageTask";
import UserProvider, { UserContext } from "./context/userContext";


const App = () => {
  return (
    <UserProvider>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* admin routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTask />} />
            <Route path="/admin/create-task" element={<CreateTask />} />
            <Route path="/admin/users" element={<ManageUser />} />
          </Route>
          {/* user routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/mytask" element={<MyTask />} />
            <Route path="/user/taskdetail/:id" element={<ViewTaskDetails />} />
          </Route>

          {/* default route */}
          <Route path="*" element={<Root />} />
        </Routes>
      </div>
    </UserProvider>
  );
};

export default App;


const Root = () => {
  const { user, loading } = useContext(UserContext);
  
  if (loading) return <Outlet />
  if (!user) {
    return <Navigate to="/login" />
  }
  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />
};
