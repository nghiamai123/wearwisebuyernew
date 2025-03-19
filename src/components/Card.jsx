"use client"

import { useState } from "react"
import Image from "next/image"
import { Rate } from "antd"
import { ShoppingCart, X } from "lucide-react"
import Link from "next/link"
import { addToCart } from "@/apiServices/cart/page"
import { useRouter } from "next/navigation"
import { useNotification } from "@/apiServices/NotificationService"

export default function Card({ product, rating }) {
  const [showOptions, setShowOptions] = useState(false)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const router = useRouter()
  const notify = useNotification()

  const colors = product.colors?.map((color) => ({
    id: color.id,
    name: color.name,
    code: color.code,
    created_at: color.created_at,
    updated_at: color.updated_at,
    pivot: color.pivot,
  }))

  const sizes = product.sizes?.map((size) => ({
    id: size.id,
    name: size.name,
    shirt_size: size.shirt_size,
    pant_size: size.pant_size,
    minimun_weight: size.minimun_weight,
    maximun_weight: size.maximun_weight,
    minimun_height: size.minimun_height,
    maximun_height: size.target_audience,
    created_at: size.created_at,
    updated_at: size.updated_at,
    pivot: size.pivot,
  }))

  const handleAddToCart = () => {
    if (!selectedColor) {
      notify("Product Color Required", "Please select a color for this product.", "topRight", "warning")
      return
    }

    if (!selectedSize) {
      notify("Product Size Required", "Please select a size for this product.", "topRight", "warning")
      return
    }

    const isUserLogin = localStorage.getItem("user")
    if (!isUserLogin) {
      notify("Login Required", "You must login to add this product to the cart.", "topRight", "warning")
      router.push("/login")
      return
    }

    const newItem = {
      product_id: id,
      product_color_id: selectedColor,
      product_size_id: selectedSize,
      quantity: "1",
    }

    addToCart(newItem)
      .then(() => {
        notify("Product Added Successfully", "Your product has been added to the cart.", "topRight")
        setShowOptions(false)
      })
      .catch((error) => {
        console.error("Add to cart error:", error)
        notify("Error Adding Product", "There was a problem adding this product to your cart.", "topRight", "error")
      })
  }

  const percentageOf = (value, percentage) => (value * percentage) / 100
  const { id, name, main_image, price, discounts } = product

  const discount = discounts?.length ? discounts[discounts.length - 1] : null
  const discountPercentage = discount?.percentage ?? 0
  const parsePrice = (price) => {
    if (typeof price === "string") {
      return Number.parseFloat(price.replace(/\./g, "")) // Loại bỏ dấu chấm ngăn cách nghìn
    }
    return Number.parseFloat(price)
  }

  const discountedPrice =
    price !== undefined && !isNaN(parsePrice(price))
      ? parsePrice(price) - percentageOf(parsePrice(price), discountPercentage)
      : 0

  const safeDiscountedPrice = discountedPrice !== undefined && !isNaN(discountedPrice) ? discountedPrice : 0
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 relative">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[2/2] w-full overflow-hidden rounded-t-lg">
          <Image
            fill
            src={main_image || "https://placehold.co/100x100"}
            alt={name}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <div className="p-2 sm:p-3 md:p-4">
        <h2 className="text-xs sm:text-sm md:text-base font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-1">{name}</h2>

        {typeof rating === "number" && (
          <div className="flex items-center mb-1 sm:mb-2">
            <div className="flex items-center text-yellow-500">
              <Rate value={rating} disabled style={{ fontSize: "12px" }} />
            </div>
            <span className="ml-1 text-[10px] sm:text-xs text-gray-600">{rating.toFixed(1)}/5</span>
          </div>
        )}

        <div className="flex flex-wrap items-center mb-1 sm:mb-2">
          <span className={`text-sm sm:text-base md:text-lg font-bold ${discount ? "text-pink-500" : ""}`}>
            {safeDiscountedPrice.toLocaleString("vi-VN")}đ
          </span>
          {discount && (
            <>
              <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">
                {price.toLocaleString("vi-VN")}đ
              </span>
              <span className="ml-1 sm:ml-2 text-pink-500 bg-red-50 px-1 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                -{Math.floor(discountPercentage)}%
              </span>
            </>
          )}
        </div>

        {sizes && (
          <>
            <button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors duration-200 text-xs sm:text-sm"
              onClick={() => setShowOptions(true)}
            >
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Add to Cart
            </button>
          </>
        )}
      </div>

      {/* Options Panel on Hover */}
      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xs mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Select Options</h3>
              <button onClick={() => setShowOptions(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Color Selection */}
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Color:</p>
              <div className="flex flex-wrap gap-2">
                {colors?.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color.id ? "border-pink-500" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.code }}
                    aria-label={`Color: ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Size:</p>
              <div className="flex flex-wrap gap-2">
                {sizes?.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded border ${
                      selectedSize === size.id
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-300"
                    }`}
                  >
                    {size.shirt_size}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-xl flex items-center justify-center transition-colors duration-200"
              disabled={!selectedColor || !selectedSize}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

