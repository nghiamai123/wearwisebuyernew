import fetchData from "@/apiServices/api/page";

export const getMyCart = (user_id) =>
  fetchData(`myCart/${user_id}`, "GET", null, {
    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

export const addToCart = (cartData) =>
  fetchData("cart/add", "POST", cartData, {
    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

export const updateCart = (cartData) =>
  fetchData("cart/update", "POST", cartData, {
    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

export const removeFromCart = (cartData) =>
  fetchData("cart/remove", "DELETE", cartData, {
    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

  

export default fetchData;
