import fetchData from "../api/page";

export const getSupplierByUserID = (user_id) =>
  fetchData(`suppliers/getSupplierByUserID/${user_id}`);