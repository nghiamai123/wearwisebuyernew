"use client"
import React, { createContext, useContext } from "react";
import { notification } from "antd";

// Tạo Context cho Notification
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  // Hàm mở thông báo
  const openNotification = (
    mess,
    des,
    placement = "topRight",
    type = "success"
  ) => {
    api[type]({
      message: mess,
      description: des,
      placement,
    });
  };

  return (
    <NotificationContext.Provider value={openNotification}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// Hook để sử dụng thông báo ở bất kỳ đâu
export const useNotification = () => useContext(NotificationContext);
