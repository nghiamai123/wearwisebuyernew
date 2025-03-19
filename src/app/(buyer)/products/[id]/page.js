"use client";

import { useState, use, useEffect } from "react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { IoMdArrowDropright } from "react-icons/io";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import axios from "axios";
import { Rate } from "antd";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CartReview from "@/components/CardReview";
import ListProducts from "@/components/ListProducts";
import Link from "next/link";
import { getProductDetails } from "@/apiServices/products/page";
import WearwiseLoading from "@/components/WearwiseLoading";
import { addToCart } from "@/apiServices/cart/page";
import { useNotification } from "@/apiServices/NotificationService";
import { useRouter } from "next/navigation";

export default function DetailProduct({ params }) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");
  const tabs = ["Details", "Rating & Reviews", "FAQs"];
  const [cart, setCart] = useState([]);
  const notify = useNotification();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const [rating, setRating] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.main_image, product?.main_image, product?.main_image];
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  useEffect(() => {
    let isMounted = true;

    if (product === null) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const data = await getProductDetails(id);
          if (isMounted) {
            setProduct(data);
          }
        } catch (error) {
          console.error("error when show data:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      setTimeout(() => {
        fetchData();
      }, 3000);
    }

    return () => {
      isMounted = false;
    };
  }, [id, product]);

  useEffect(() => {
    if (product) {
      setRating(
        product.reviews.reduce((sum, cur) => sum + cur.rating, 0) /
          product.reviews.length
      );
    }
  }, [product]);

  const handleAddToCart = (
    productId,
    productColorId,
    productSizeId,
    quantity
  ) => {
    if (!selectedColor || !selectedSize) {
      notify(
        "Product Color and Size Required",
        "Please select a color and size for this product.",
        "topRight",
        "warning"
      );
      return;
    }

    const isUserLogin = localStorage.getItem("user");
    const isAlreadyInCart = cart.some(
      (item) =>
        item.product_id === productId &&
        item.product_color_id === productColorId &&
        item.product_size_id === productSizeId
    );
    if (isAlreadyInCart && isUserLogin) {
      notify(
        "Product Added to Cart",
        "Your product has been added to the cart.",
        "topRight",
        "warning"
      );
      return;
    } else if (!isUserLogin) {
      notify(
        "Login Required",
        "You must login to add this product to the cart.",
        "topRight",
        "warning"
      );
      router.push("/login");
      return;
    }

    const newItem = {
      product_id: productId,
      product_color_id: productColorId,
      product_size_id: productSizeId,
      quantity: quantity,
    };

    setCart([...cart, newItem]);

    if (selectedColor && selectedSize) {
      addToCart(newItem)
        .then(() =>
          notify(
            "Product Added Successfully",
            "Your product has been added to the inventory.",
            "topRight"
          )
        )
        .catch((error) => console.error("Add to cart error:", error));
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      if (!isFavorite) {
        await axios.post(
          `${API_BASE_URL}/api/wishlists`,
          { product_id: id },
          { headers }
        );
        notify(
          "Product Added wishlist Successfully",
          "Your product has been added to the wishlist.",
          "topRight"
        );
      } else {
        await axios.delete(`${API_BASE_URL}/api/wishlists/${id}`, { headers });
        notify(
          "Product deleted wishlist Successfully",
          "Your product has been added to the wishlist.",
          "topRight"
        );
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const handleTryOn = () => {
    if (!selectedColor || !selectedSize) {
      notify(
        "Product Color and Size Required",
        "Please select a color and size for this product.",
        "topRight",
        "warning"
      );
      return;
    }

    const isUserLogin = localStorage.getItem("user");

    if (!isUserLogin) {
      notify(
        "Login Required",
        "You must login to add this product to the cart.",
        "topRight",
        "warning"
      );
      router.push("/login");
      return;
    }

    localStorage.setItem("BuyNowWithTryOn", true);
    localStorage.setItem("buy_now_product", JSON.stringify(product));
    localStorage.setItem(
      "buy_now_product_colorId",
      JSON.stringify(selectedColor)
    );
    localStorage.setItem(
      "buy_now_product_sizeId",
      JSON.stringify(selectedSize)
    );
    localStorage.setItem("buy_now_product_quantity", JSON.stringify(quantity));

    if (typeof window !== "undefined" && selectedImage) {
      localStorage.setItem("tryOnImage", selectedImage);
      router.push("/tryOnK");
    } else {
      notify("Please select an image to try on", "", "topRight", "warning");
    }
  };

  const handleBuyNow = (product, selectedColor, selectedSize) => {
    if (!selectedColor || !selectedSize) {
      notify(
        "Product Color and Size Required",
        "Please select a color and size for this product.",
        "topRight",
        "warning"
      );
      return;
    }

    const isUserLogin = localStorage.getItem("user");
    const isAlreadyInCart = cart.some(
      (item) =>
        item.product_id === product.id &&
        item.product_color_id === selectedColor &&
        item.product_size_id === selectedSize
    );
    if (isAlreadyInCart && isUserLogin) {
      notify(
        "Product Added to Cart",
        "Your product has been added to the cart.",
        "topRight",
        "warning"
      );
      return;
    } else if (!isUserLogin) {
      notify(
        "Login Required",
        "You must login to add this product to the cart.",
        "topRight",
        "warning"
      );
      router.push("/login");
      return;
    }
    localStorage.setItem("buy_now_product", JSON.stringify(product));
    localStorage.setItem(
      "buy_now_product_colorId",
      JSON.stringify(selectedColor)
    );
    localStorage.setItem(
      "buy_now_product_sizeId",
      JSON.stringify(selectedSize)
    );
    localStorage.setItem("buy_now_product_quantity", JSON.stringify(quantity));
    router.push("/order/now");
  };

  const percentageOf = (value, percentage) => {
    const numValue = Number.parseFloat(
      value.toString().replace(/\./g, "").replace("đ", "").trim()
    );
    const numPercentage = Number.parseFloat(percentage);

    if (isNaN(numValue) || isNaN(numPercentage)) return "0";

    const result = Math.round((numValue * numPercentage) / 100);

    return result.toLocaleString("vi-VN");
  };

  if (isLoading) {
    return <WearwiseLoading></WearwiseLoading>;
  }

  return (
    <>
      <div className="bg-white text-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-16 p-4">
          <nav className="text-sm mb-4 flex gap-2 text-end">
            <Link className="text-gray-500 hover:text-gray-700" href="/">
              Home
            </Link>{" "}
            <IoMdArrowDropright className="pt-1 h-full" />
            <Link className="text-gray-500 hover:text-gray-700" href="#">
              Product
            </Link>{" "}
          </nav>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Images Section */}
            <div className="w-full lg:w-1/2">
              {/* Main Image */}
              <div className="mb-4">
                <Image
                  alt="Main product image"
                  className="w-full h-auto rounded-lg object-cover"
                  height="800"
                  src={selectedImage ? selectedImage : product.main_image}
                  width="600"
                />
              </div>

              {/* Thumbnails - Horizontal scroll on all devices */}
              <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                {images.map((value, index) =>
                  value ? (
                    <Image
                      key={index}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-20 rounded-lg cursor-pointer flex-shrink-0 object-cover ${
                        selectedImage === (value.url ? value.url : value)
                          ? "border-2 border-pink-500"
                          : "border border-gray-200"
                      }`}
                      height="100"
                      src={value.url ? value.url : value}
                      width="100"
                      onClick={() =>
                        setSelectedImage(value.url ? value.url : value)
                      }
                    />
                  ) : null
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-1/2 lg:pl-8">
              <h1 className="text-2xl font-bold mb-2">
                {product ? product.name : "loading..."}
              </h1>

              <div className="flex items-center mb-2">
                <div className="flex items-center text-yellow-500">
                  <Rate allowHalf value={rating} disabled />
                </div>
                <span className="ml-2 text-gray-600">
                  {rating ? rating.toFixed(0) : 0}/5
                </span>
                <button onClick={toggleFavorite} className="ml-2 text-red-500">
                  {isFavorite ? <HeartFilled /> : <HeartOutlined />}
                </button>
              </div>

              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold">
                  {product ? product.price.toLocaleString("vi-VN") : 0}đ
                </span>
                {product && product.discounts.length > 0 ? (
                  <div className="ml-2">
                    {product.discounts.map((discount) => {
                      const discountedPrice = percentageOf(
                        product.price,
                        discount.percentage
                      );
                      return (
                        <p key={discount.id} className="flex items-center">
                          <span className="text-gray-500">
                            {discount.code} -
                          </span>
                          <span className="text-gray-500 ml-2 line-through">
                            {discountedPrice}đ
                          </span>
                          <span className="text-pink-500 ml-2">
                            {(discount.percentage * 1).toFixed(0)}%
                          </span>
                        </p>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <p className="text-gray-600 mb-4 w-full md:w-2/3">
                {product ? product.description : ""}
              </p>

              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Select Colors</h2>
                <div className="flex flex-wrap gap-2">
                  {product?.colors?.map((color) => (
                    <button
                      key={color.id}
                      id={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative w-10 h-10 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${
                        selectedColor === color.id ? "shadow-xl scale-110" : ""
                      }`}
                      style={{ backgroundColor: color.code }}
                    >
                      {selectedColor === color.id && (
                        <RiCheckboxCircleLine className="absolute text-pink-500 text-2xl top-2 right-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Choose Size</h2>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map((size) => (
                    <button
                      key={size.id}
                      id={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-4 py-2 border border-spacing-1 rounded-xl ${
                        selectedSize === size.id
                          ? "bg-gray-800 text-white"
                          : "bg-white text-gray-800"
                      } transition-all duration-300 hover:shadow-xl`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-2">Quantity</h2>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="px-4">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <div
                  onClick={() =>
                    handleTryOn(product, selectedColor, selectedSize, quantity)
                  }
                >
                  <button className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-xl w-full">
                    Try to 2D
                  </button>
                </div>
                <button
                  className="px-4 mt-4 py-2 bg-pink-500 text-white rounded-xl flex"
                  onClick={() =>
                    handleAddToCart(
                      product?.id,
                      selectedColor,
                      selectedSize,
                      quantity
                    )
                  }
                >
                  Add to Cart
                </button>
                <button
                  className="px-4 py-2 mt-4 bg-pink-500 text-white rounded-xl flex relative"
                  onClick={() =>
                    handleBuyNow(product, selectedColor, selectedSize, quantity)
                  }
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <hr></hr>

          <ListProducts title="You might also like" />

          {/* Tabs */}
          <div className="mt-8 relative">
            {/* Navigation Tabs */}
            <div className="flex justify-center flex-wrap gap-2 md:gap-0 md:space-x-8 border-b">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-4 transition-all duration-300 ${
                    activeTab === tab
                      ? "text-black font-semibold"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full text-center p-4 mt-4"
              >
                {activeTab === "Details" && (
                  <div className="inline-block">
                    <div className="bg-gray-100">
                      <div className="max-w-4xl p-4 bg-white shadow-md rounded-md">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Image
                              alt="Avatar of supplier"
                              className="w-20 h-20 rounded-full"
                              height="100"
                              src={
                                product?.supplier?.avatar
                                  ? product?.supplier?.avatar
                                  : "https://placehold.co/100x100"
                              }
                              width="100"
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <h2 className="text-xl font-semibold"></h2>
                            <div className="flex items-center">
                              <span>Shop: </span>
                              <span className="ml-2 text-red-500">
                                {product && product.supplier.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span>Address: </span>
                              <span className="ml-2 text-red-500">
                                {product && product.supplier.address}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span>Phone Number: </span>
                              <span className="ml-2 text-red-500">
                                {product && product.supplier.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "Rating & Reviews" && (
                  <>
                    <div className="flex items-center space-x-4 p-4 justify-between">
                      <div className="text-lg font-semibold">
                        All Reviews{" "}
                        <span className="text-gray-500">
                          {product && product.reviews.length}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 md:gap-8 justify-center md:justify-start">
                      {product.reviews.length > 0 &&
                        product.reviews.map((review, index) => (
                          <CartReview
                            key={index}
                            numStar={review.rating}
                            author={review.user.name}
                            comment={review.content}
                          />
                        ))}
                    </div>
                  </>
                )}
                {activeTab === "FAQs" && (
                  <p className="inline-block">
                    ❓ Frequently Asked Questions...
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
