import { useContext, useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useNavigate, useLocation } from "react-router";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";

// Menu items.
export function SideMenu() {
  const { user, clearUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ will be used for active menu highlight

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setSideMenuData(
        user?.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA
      );
    }
  }, [user]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50">
              {/* Profile Section */}
              <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <div>
                  <img
                    className="w-20 h-20 rounded-full bg-slate-50"
                    src={user?.profileImageUrl || ""}
                    alt="profile"
                  />
                </div>
                {user?.role === "admin" && (
                  <div className="text-[10px] font-medium bg-blue-500 text-white py-0.5 px-2 rounded mt-1">
                    admin
                  </div>
                )}
                <h5 className="text-gray-950 font-medium leading-6 mt-2">

                  { user?.organizationToken || ""}
                </h5>
                <h5 className="text-gray-950 font-medium leading-6 mt-2">
                  {user?.name || ""}
                </h5>
                <p className="text-[12px] text-gray-600">{user?.email || ""}</p>
              </div>

              {/* Menu Items */}
              {sideMenuData.map((item, index) => {
                const isActive = location.pathname === item.path; // ✅ compare current path

                return (
                  <SidebarMenuItem key={`menu_${index}`}>
                    <SidebarMenuButton
                      asChild
                      onClick={() => handleClick(item.path)}
                      className={`w-full flex items-center gap-4 text-[15px] py-3 px-4 mb-3 rounded-lg ${
                        isActive
                          ? "text-blue-500 bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-2 border-blue-500"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 cursor-pointer">
                        <item.icon className="w-4 h-4 text-xl" />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
