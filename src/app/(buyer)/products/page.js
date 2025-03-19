"use client";

import SidebarFilter from "@/components/SidebarFilterProducts";
import { useProducts } from "@/Context/ProductContext";
import Card from "@/components/Card";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  searchProduct,
  fetchFilteredProducts,
} from "@/apiServices/products/page";
import { useNotification } from "@/apiServices/NotificationService";

const ProductPage = () => {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.toString();
  const [productList, setProductList] = useState(products || []);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(true);
  const notify = useNotification();

  // Hàm parse query thành filter object
  const parseQueryToFilter = (params) => {
    try {
      const filter = {};

      if (params.has("minPrice")) {
        const minPrice = Number(params.get("minPrice"));
        if (!isNaN(minPrice)) filter.minPrice = minPrice;
      }

      if (params.has("maxPrice")) {
        const maxPrice = Number(params.get("maxPrice"));
        if (!isNaN(maxPrice)) filter.maxPrice = maxPrice;
      }

      // Lấy tất cả các giá trị categories
      const categoryValues = params.getAll("categories");
      if (categoryValues.length > 0) {
        filter.categories = categoryValues;
      }

      // Lấy tất cả các giá trị colors
      const colorValues = params.getAll("colors");
      if (colorValues.length > 0) {
        filter.colors = colorValues;
      }

      // Lấy tất cả các giá trị sizes
      const sizeValues = params.getAll("sizes");
      if (sizeValues.length > 0) {
        filter.sizes = sizeValues;
      }

      if (params.has("sortPrice")) {
        const sortValue = params.get("sortPrice");
        filter.sortPrice =
          sortValue === "asc" || sortValue === "desc" ? sortValue : null;
      }

      return filter;
    } catch (error) {
      console.error("Error parsing filter query:", error);
      return {};
    }
  };

  useEffect(() => {
    if (!searchQuery && productList.length === products.length) return;

    const fetchProducts = async () => {
      if (!searchQuery) {
        setProductList(products);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams(searchQuery);

        if (params.has("search")) {
          const query = params.get("search")?.trim() || "";

          if (!query || /^[^a-zA-Z0-9]+$/.test(query)) {
            notify("Search", "No products found.", "topRight", "info");
            setProductList([]);
            setLoading(false);
            return;
          }

          const result = await searchProduct(query);
          updateProductList(result);
        } else if (
          params.has("minPrice") ||
          params.has("maxPrice") ||
          params.has("categories") ||
          params.has("colors") ||
          params.has("sizes") ||
          params.has("sortPrice")
        ) {
          // Sử dụng hàm parseQueryToFilter để chuyển đổi query params thành filter object
          const filterParams = parseQueryToFilter(params);
          console.log("Filter params:", filterParams);

          const result = await fetchFilteredProducts(filterParams);
          updateProductList(result);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        notify(
          "Search",
          "An error occurred while fetching products.",
          "topRight",
          "error"
        );
        setProductList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, products]);

  const updateProductList = (result) => {
    if (!Array.isArray(result) || result.length === 0) {
      setResult(false);
      notify("Search", "No products found.", "topRight", "info");
    } else {
      setResult(true);
    }
    setProductList(Array.isArray(result) ? result : []);
  };

  const handleViewAll = () => {
    router.push("/products");
    setProductList(products);
    setResult(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <SidebarFilter />
        <div className="flex-1">
          {productList.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <p
                className="text-sm text-gray-600 cursor-pointer"
                onClick={handleViewAll}
              >
                Showing {productList.length} results
              </p>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : result ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {productList.map((product) => (
                <div key={product.id}>
                  <Card
                    product={product}
                    rating={
                      product.reviews?.length > 0
                        ? product.reviews.reduce(
                            (sum, cur) => sum + cur.rating,
                            0
                          ) / product.reviews.length
                        : 0
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 max-w-md">
                We couldn&lsquo;t find any products matching your search
                criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleViewAll}
                className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                View all products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
