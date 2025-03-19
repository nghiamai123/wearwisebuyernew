"use client";

import { useState } from "react";
import { Spin, Tag, Divider } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import Image from "next/image";
import ReviewButton from "./ReviewButton";

export default function OrdersByStatus({ orders, status, loading, notify }) {
  // State to track which items have their review forms open
  const [openReviewForms, setOpenReviewForms] = useState({});
  // State to track which items have been reviewed during this session
  const [reviewedItems, setReviewedItems] = useState({});

  // Toggle review form visibility for a specific item
  const toggleReviewForm = (itemId) => {
    setOpenReviewForms((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const markAsReviewed = (itemId) => {
    setReviewedItems((prev) => ({
      ...prev,
      [itemId]: true,
    }));
    setOpenReviewForms((prev) => ({
      ...prev,
      [itemId]: false,
    }));
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const filteredOrders = orders
    .map((order) => ({
      ...order,
      items: order.items.filter((item) => item.status === status),
    }))
    .filter((order) => order.items.length > 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spin size="large" />
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <ShoppingOutlined className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-500">No {status} orders found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <p className="text-gray-500 text-sm">
                Placed on {formatDate(order.order_date)}
              </p>
            </div>
            <Tag
              color={
                status === "completed"
                  ? "green"
                  : status === "pending"
                  ? "orange"
                  : "red"
              }
              className="font-medium"
            >
              {status}
            </Tag>
          </div>

          <Divider className="my-4" />

          {order.items.map((item, index) => (
            <div key={item.order_item_id}>
              <div
                className={`flex items-center gap-6 ${
                  index > 0 ? "pt-4 border-t" : ""
                }`}
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.main_image || "https://placehold.co/100x100"}
                    alt={item.product_name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.product_name}</h4>
                  <div className="text-sm text-gray-600">
                    <p>Color: {item.color_name}</p>
                    <p>Size: {item.shirt_size || item.pant_size}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.price}đ</p>
                </div>
              </div>

              {/* For completed items, show review button or form or reviewed status */}
              {status === "completed" && (
                <div className="mt-3">
                  <ReviewButton
                    itemId={item.order_item_id}
                    isOpen={openReviewForms[item.order_item_id]}
                    onToggle={() => toggleReviewForm(item.order_item_id)}
                    onReviewSuccess={() => markAsReviewed(item.order_item_id)}
                    isReviewed={
                      item.reviewed || reviewedItems[item.order_item_id]
                    }
                    notify={notify}
                  />
                </div>
              )}
            </div>
          ))}

          <Divider className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              {order.payment_method !== "cod" && (
                <p className="text-gray-600">
                  Payment: {order.payment_method.toUpperCase()}
                </p>
              )}
              <p className="font-semibold text-lg">
                Total: {(order.total_amount * 1).toFixed(3)}đ
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
