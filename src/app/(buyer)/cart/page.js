"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { getMyCart, removeFromCart, updateCart } from "@/apiServices/cart/page";
import WearwiseLoading from "@/components/WearwiseLoading";
import { useNotification } from "@/apiServices/NotificationService";
import { ShoppingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const notify = useNotification();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.id;

      const fetchCartItems = async () => {
        try {
          const response = await getMyCart(userId);
          setCartItems(response.cart);
          updateSubtotal(response.cart);

          const storedSubtotal = localStorage.getItem("subtotal");
          const storedDiscount = localStorage.getItem("discount");
          if (storedSubtotal) setSubtotal(parseFloat(storedSubtotal));
          if (storedDiscount) setTotalDiscount(parseFloat(storedDiscount));
        } catch (error) {
          console.error("Error fetching cart items:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchCartItems();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSubtotal = (items) => {
    let total = 0;
    let totalDiscount = 0;
    const now = new Date();
    let discountApplied = false;

    items.forEach((item) => {
      total += item.product.price * item.quantity;

      const validDiscount = item.discounts.find(
        (d) =>
          d.code === discountCode &&
          now >= new Date(d.start_date) &&
          now <= new Date(d.end_date)
      );

      if (validDiscount) {
        totalDiscount +=
          (item.product.price * item.quantity * validDiscount.percentage) / 100;
        discountApplied = true;
      }
    });

    setSubtotal(total);
    setTotalDiscount(totalDiscount);

    localStorage.setItem("discount", totalDiscount);
    localStorage.setItem("total", total - totalDiscount);
  };

  useEffect(() => {
    if (discountCode) {
      if (totalDiscount > 0) {
        localStorage.setItem("discount", totalDiscount);
        localStorage.setItem("total", subtotal - totalDiscount);
        notify(
          "Discount Applied",
          `Your discount has been successfully applied. You saved ${totalDiscount} VND.`,
          "topRight"
        );
      } else {
        notify(
          "Invalid Discount Code",
          "The discount code is either expired or not applicable.",
          "topRight",
          "warning"
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDiscount, subtotal]);

  const applyDiscount = () => {
    updateSubtotal(cartItems);
  };

  const confirmRemoveItem = async () => {
    if (itemToRemove) {
      try {
        const response = await removeFromCart({ cart_item_id: itemToRemove });
        if (response) {
          const updatedCart = cartItems.filter(
            (item) => item.cart_item_id !== itemToRemove
          );
          setCartItems(updatedCart);
          updateSubtotal(updatedCart);
        }

        notify(
          "Product Removed",
          "Your product has been removed from the cart.",
          "topRight"
        );
      } catch (error) {
        console.error("Error removing item:", error);
      } finally {
        setShowModal(false);
        setItemToRemove(null);
      }
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await updateCart({
        cart_item_id: cartItemId,
        quantity: newQuantity,
      });

      if (response) {
        setCartItems((prevItems) => {
          const updatedItems = prevItems.map((item) =>
            item.cart_item_id === cartItemId
              ? { ...item, quantity: newQuantity }
              : item
          );
          updateSubtotal(updatedItems);
          return updatedItems;
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleCheckOut = () => {
    if (subtotal == 0) {
      notify(
        "Order processing procedure",
        "Please add a product to your cart",
        "topRight",
        "warning"
      );
    } else {
      router.push("/order");
    }
    return;
  };

  if (loading) return <WearwiseLoading />;

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto p-4">
        <nav className="text-sm mb-4 flex gap-2 text-end">
          <Link className="text-gray-500 hover:text-gray-700" href="/">
            Home
          </Link>
          <IoMdArrowDropright className="pt-1 h-full" />
          <Link className="text-gray-500 hover:text-gray-700" href="/cart">
            Cart
          </Link>
        </nav>
        <h1 className="text-2xl font-bold mb-6">Your cart</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Image
                      alt={item.product.name}
                      className="w-16 h-16 rounded-lg mr-4"
                      height={60}
                      width={60}
                      src={item.product.main_image}
                    />
                    <div>
                      <h2 className="font-semibold">{item.product.name}</h2>
                      <p className="text-sm text-gray-500">
                        Size: {item.size?.name}, Color: {item.color?.name}
                      </p>
                      <p className="font-bold mt-2">{item.product?.price}đ</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.cart_item_id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-2 py-1 bg-gray-300 rounded"
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cart_item_id, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-pink-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => {
                      setItemToRemove(item.cart_item_id);
                      setShowModal(true);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <div>
                <div className="text-center py-12 bg-white rounded-lg">
                  <ShoppingOutlined className="text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-500">Your cart is empty.</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>{(subtotal * 1000).toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Discount</span>
                <span className="text-pink-500">
                  -{(totalDiscount * 1000).toLocaleString("vi-VN")}đ
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>
                  {((subtotal - totalDiscount) * 1000).toLocaleString("vi-VN")}đ
                </span>
              </div>

              <input
                type="text"
                className="w-full border p-2 rounded mb-2"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                onClick={applyDiscount}
                className="bg-pink-500 text-white w-full py-2 rounded-lg mb-4"
              >
                Apply Discount
              </button>
              <button
                onClick={() => handleCheckOut()}
                className="bg-black text-white w-full py-3 rounded-lg"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Removal</h2>
            <p>Are you sure you want to remove this item from your cart?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded"
                onClick={confirmRemoveItem}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
