import fetchData from "@/apiServices/api/page";

export const getColors = () => fetchData("colors");

export const getColorById = (id) => fetchData(`colors/${id}`);

export const createColor = (colorData) =>
  fetchData("colors", "POST", colorData);

export const updateColor = (id, colorData) =>
  fetchData(`colors/${id}`, "PUT", colorData);

export const deleteColor = (id) => fetchData(`colors/${id}`, "DELETE");
