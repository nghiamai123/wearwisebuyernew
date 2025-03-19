import fetchData from "../api/page";

export const virtualTryon = (data) =>
  fetchData("virtual-tryon", "POST", data, {
    "x-rapidapi-host": "virtual-try-on2.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
  });
