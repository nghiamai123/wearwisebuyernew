import fetchData from "../api/page";

export const getDiscounts = () => fetchData("discounts");

export const createDiscount = (discountData) =>
  fetchData("discounts", "POST", discountData);

export const updateDiscount = async (id, discountData) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/discounts/${id}`,
    {
      method: "POST",
      body: discountData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw { status: response.status, data: result }; 
  }

  return result;
};

export const deleteDiscount = (id) => fetchData(`discounts/${id}`, "DELETE");