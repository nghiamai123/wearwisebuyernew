"use client"

import { useEffect, useState } from "react"

const WearwiseLoading = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-[9999]">
      <div className="text-center">
        {/* Hiển thị trên màn hình nhỏ (hai dòng) */}
        <div className="inline-block md:hidden">
          {mounted && (
            <>
              <div className="flex justify-center mb-2">
                <div className="inline-flex items-end">
                  <span
                    className="text-red-600 text-4xl sm:text-5xl font-bold animate-wave"
                    style={{ animationDelay: "0ms" }}
                  >
                    W
                  </span>
                  <span
                    className="text-black text-3xl sm:text-4xl font-bold animate-wave"
                    style={{ animationDelay: "100ms" }}
                  >
                    E
                  </span>
                  <span
                    className="text-black text-3xl sm:text-4xl font-bold animate-wave"
                    style={{ animationDelay: "200ms" }}
                  >
                    A
                  </span>
                  <span
                    className="text-black text-3xl sm:text-4xl font-bold animate-wave w-5"
                    style={{ animationDelay: "300ms" }}
                  >
                    R
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="inline-flex items-end">
                  <span
                    className="text-black text-4xl sm:text-5xl font-bold animate-wave"
                    style={{ animationDelay: "400ms" }}
                  >
                    W
                  </span>
                  <span
                    className="text-black text-3xl sm:text-4xl font-bold animate-wave"
                    style={{ animationDelay: "500ms" }}
                  >
                    I
                  </span>
                  <span
                    className="text-black text-3xl sm:text-4xl font-bold animate-wave"
                    style={{ animationDelay: "600ms" }}
                  >
                    S
                  </span>
                  <span
                    className="text-black text-3xl sm:text-4xl font-bold animate-wave w-5"
                    style={{ animationDelay: "700ms" }}
                  >
                    E
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hiển thị trên màn hình lớn (một dòng) */}
        <div className="hidden md:inline-block">
          {mounted && (
            <div className="flex justify-center">
              <div className="inline-flex items-end">
                <span
                  className="text-red-600 text-5xl lg:text-6xl font-bold animate-wave"
                  style={{ animationDelay: "0ms" }}
                >
                  W
                </span>
                <span
                  className="text-black text-4xl lg:text-5xl font-bold animate-wave"
                  style={{ animationDelay: "100ms" }}
                >
                  E
                </span>
                <span
                  className="text-black text-4xl lg:text-5xl font-bold animate-wave"
                  style={{ animationDelay: "200ms" }}
                >
                  A
                </span>
                <span
                  className="text-black text-4xl lg:text-5xl font-bold animate-wave"
                  style={{ animationDelay: "300ms" }}
                >
                  R
                </span>
                <span
                  className="text-black text-5xl lg:text-6xl font-bold animate-wave"
                  style={{ animationDelay: "400ms" }}
                >
                  W
                </span>
                <span
                  className="text-black text-4xl lg:text-5xl font-bold animate-wave"
                  style={{ animationDelay: "500ms" }}
                >
                  I
                </span>
                <span
                  className="text-black text-4xl lg:text-5xl font-bold animate-wave"
                  style={{ animationDelay: "600ms" }}
                >
                  S
                </span>
                <span
                  className="text-black text-4xl lg:text-5xl font-bold animate-wave w-5"
                  style={{ animationDelay: "700ms" }}
                >
                  E
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WearwiseLoading

