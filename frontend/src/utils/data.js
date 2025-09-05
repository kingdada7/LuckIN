import {
 

 
  LucideClipboardCheck,
  LucideLayoutDashboard,
  LucideLogOut,
  LucideSquareCheck,
  LucideSquarePlus,
  LucideUser,
} from "lucide-react";
export const SIDE_MENU_USER_DATA = [
  {
    title: "Manage Tasks",
    url: "#",
    icon: LucideClipboardCheck,
    path: "/user/tasks",
  },
  {
    title: "My Task",
    url: "#",
    icon: LucideSquareCheck,
    path: "/user/mytask",
  },

  {
    title: "Logout",
    url: "#",
    icon: LucideLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

export const SIDE_MENU_DATA = [
  {
    title: "Dashboard",
    url: "#",
    icon: LucideLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Manage Tasks",
    url: "#",
    icon: LucideClipboardCheck,
    path: "/admin/tasks",
  },
  {
    title: "Create task",
    url: "#",
    icon: LucideSquarePlus,
    path: "/admin/create-task",
  },
  {
    title: "Team Members",
    url: "#",
    icon: LucideUser,
    path: "/admin/users",
  },
  {
    title: "Logout",
    url: "#",
    icon: LucideLogOut,
    path: "logout",
  },
];
