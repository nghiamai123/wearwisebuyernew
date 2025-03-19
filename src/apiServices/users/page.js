import fetchData from "../api/page";

export const viewProfile = () =>
  fetchData("auth/profile", "GET", null, {
    authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  });

export const updateProfile = (userId, data) =>
  // console.log(data, userId);
  fetchData(`users/${userId}`, "PUT", data, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });
