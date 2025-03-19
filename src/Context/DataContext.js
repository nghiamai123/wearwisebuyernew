"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getSizes } from "@/apiServices/size/page";
import { getColors } from "@/apiServices/colors/page";
import { getDiscounts } from "@/apiServices/discounts/page";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sizesData, colorsRes, discountsData] = await Promise.all([
          getSizes(),
          getColors(),
          getDiscounts(),
        ]);

        setSizes(sizesData);
        setColors(colorsRes.data);
        setDiscounts(discountsData);
      } catch (error) {
        console.error("Fetch data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ sizes, colors, discounts, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
