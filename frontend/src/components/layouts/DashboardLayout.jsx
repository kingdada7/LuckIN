import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { SideMenu } from "./SideMenu";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user && (
        <SidebarProvider isActive="Dashboard" >
          <div className="flex h-screen w-full">
            {/* Sidebar (hidden on small screens) */}
            <div className="max-[1080px]:hidden">
              <SideMenu activeMenu={activeMenu} />
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 px-10">
              {/* Top bar with trigger */}
              <header className="flex items-center h-14 border-b px-2">
                <SidebarTrigger />
                <h1 className="ml-4 font-bold">{activeMenu}</h1>
              </header>

              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      )}
    </div>
  );
};

export default DashboardLayout;
