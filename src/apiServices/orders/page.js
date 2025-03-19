import fetchData from "@/apiServices/api/page";

export const getUserOrders = (id) =>
  fetchData(`orders/${id}`, "GET", null, {
    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

export const createOrderFromCart = (id, total_amount, status, payment_method) =>
  fetchData(
    `orders/${id}`,
    "POST",
    {
      total_amount: total_amount,
      status: status,
      payment_method: payment_method,
    },
    {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  );

export const updateOrderStatus = (id, status, userId, orderId) =>
  fetchData(
    `orders/${id}`,
    "POST",
    {
        "status": status,
        "userId": userId,
        "orderId": orderId
    },
    {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    }
  );
  
