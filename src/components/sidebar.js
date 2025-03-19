"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotification } from "@/apiServices/NotificationService";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  DollarSign,
} from "lucide-react";

export default function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const notify = useNotification();

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token không tồn tại.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        notify("Logout", "Logout Successful.", "topRight", "success");
        setIsLoggedIn(false);
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        console.error(
          "Logout failed",
          errorData.message || "Lỗi không xác định."
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  

  const routes = [
    {
      name: "Dashboard",
      path: "/supplier",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Products",
      path: "/supplier/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: "Orders",
      path: "/supplier/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      name: "Comments",
      path: "/supplier/comments",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Discounts",
      path: "/supplier/discounts",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: "Logout",
      path: "#",
      icon: <LogOut className="h-5 w-5 text-red-500" />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r shadow-md flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Supplier Dashboard</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {routes.map((route) =>
          route.name === "Logout" ? (
            <button
              key={route.name}
              onClick={route.onClick}
              className="flex items-center w-full px-4 py-3 text-sm rounded-md transition-colors text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {route.icon}
              <span className="ml-3">{route.name}</span>
            </button>
          ) : (
            <Link
              key={route.path}
              href={route.path}
              className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors
                ${
                  pathname === route.path
                    ? "bg-gray-100 dark:bg-gray-700 text-primary font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              {route.icon}
              <span className="ml-3">{route.name}</span>
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
