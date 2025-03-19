"use client";

import { useState, useEffect } from "react";
import ColorFilter from "@/components/ColorFilter";
import { getColors } from "@/apiServices/colors/page";
import { useRouter } from "next/navigation";

export default function SidebarFilter() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 300,
    colors: [],
    sizes: [],
    sortPrice: "asc",
  });

  const [colors, setColors] = useState([]); // Lưu trữ màu từ API

  useEffect(() => {
    async function fetchColors() {
      try {
        const { data } = await getColors();
        setColors(data); // Lưu danh sách màu
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    }
    fetchColors();
  }, []);

  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const updatedArray = prev[type]?.includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
  
      return { ...prev, [type]: updatedArray };
    });
  };
  
  const handlePriceChange = (e, type) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortPrice: e.target.value }));
  };

  const applyFilters = () => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) => {
          if (Array.isArray(value)) return value.length > 0;
          return value !== null && value !== "" && value !== undefined;
        })
      );
  
      // Chuyển đổi dữ liệu thành query string đúng định dạng
      const queryString = new URLSearchParams();
  
      Object.entries(filteredData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => queryString.append(key, val));
        } else {
          queryString.append(key, value);
        }
      });
  
      // Kiểm tra query string trước khi điều hướng
      const newUrl = `/products?${queryString.toString()}`;
      console.log("Navigating to:", newUrl);
  
      // Cập nhật URL với các tham số lọc
      router.push(newUrl);
    } catch (error) {
      console.error("Error updating filters:", error);
    }
  };
  

  return (
    <div className="w-64 pr-8" >
      <h3 className="text-lg font-medium mb-4">Filters</h3>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-gray-800">Categories</h4>
        {["T-shirt", "Shorts", "Shirt", "Hoodies", "Pants", "Sweater"].map((category) => (
          <label key={category} className="flex items-center space-y-3 space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.categories.includes(category)}
              onChange={() => handleCheckboxChange("categories", category)}
              className="hidden"
            />
            <div className="relative w-6 h-6 rounded-lg border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 shadow-md flex items-center justify-center transition-all duration-300 hover:from-gray-200 hover:to-gray-300 hover:shadow-lg">
              {filters.categories.includes(category) && (
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-gray-800 text-sm font-medium transition-all duration-300 hover:text-blue-500">
              {category}
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Price Range</h4>
        <input
          type="number"
          value={filters.minPrice ?? 0}
          onChange={(e) => handlePriceChange(e, "minPrice")}
          placeholder="Min Price"
          className="w-full border rounded px-2 py-1 mb-2"
        />
        <input
          type="number"
          value={filters.maxPrice ?? 0}
          onChange={(e) => handlePriceChange(e, "maxPrice")}
          placeholder="Max Price"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* Colors */}
      <ColorFilter colors={colors} selectedColors={filters.colors} handleCheckboxChange={handleCheckboxChange} />

      {/* Sizes */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Sizes</h4>
        {["S", "M", "L", "XL"].map((size, index) => (
          <label className="flex items-center space-y-3 space-x-3 cursor-pointer" key={index}>
            <input
              type="checkbox"
              checked={filters.sizes.includes(size)}
              onChange={() => handleCheckboxChange("sizes", size)}
              className="hidden"
            />
            <div className="relative w-6 h-6 rounded-lg border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 shadow-md flex items-center justify-center transition-all duration-300 hover:from-gray-200 hover:to-gray-300 hover:shadow-lg">
              {filters.sizes.includes(size) && (
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-gray-800 text-sm font-medium transition-all duration-300 hover:text-blue-500">
              {size}
            </span>
          </label>
        ))}
      </div>

      {/* Sort by Price */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Sort by price</h4>
        <select
          value={filters.sortPrice}
          onChange={handleSortChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <button
        onClick={applyFilters}
        className="w-full rounded-lg bg-black text-white px-4 py-2 hover:bg-black/90"
      >
        Apply Filter
      </button>
    </div>
  );
}
