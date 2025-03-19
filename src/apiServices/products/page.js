import fetchData from "@/apiServices/api/page";
import { env } from "process";

export const getProducts = () => fetchData("products");

export const getProductWithSizeAndColor = () => fetchData("productswithsize");
export const getProductBySupplierID = (id) =>
  fetchData(`productsbysupplierID/${id}`);
export const getProductById = (id) => fetchData(`products/${id}`);
export const getProductDetails = (id) => fetchData(`products/more/${id}`);
export const createProduct = (productData) =>
  fetchData("products", "POST", productData);

export const updateProduct = async (id, productData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${id}`,
    {
      method: "POST",
      body: productData,
    }
  );
  return response.json();
};

export const deleteProduct = (id) => fetchData(`products/${id}`, "DELETE");

export const searchProduct = (name) =>
  fetchData("buyer/products/search", "POST", {
    name: name,
  });

export const fetchFilteredProducts = async (filter) => {
  try {
    const result = await fetchData("buyer/products/filter", "POST", filter);
    return result;
  } catch (error) {
    console.error("Fetch filter error:", error);
    return [];
  }
};

export default fetchData;
