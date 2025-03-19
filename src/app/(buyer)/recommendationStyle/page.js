"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Card from "@/components/Card";
import Link from "next/link";

export default function RecommendStyle() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="bg-white text-gray-800">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Recommend UI</h1>

        <div className="flex justify-center">
          <div
            className="border-2 border-gray-300 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer hover:bg-gray-100 transition w-1/3"
            onClick={handleClick}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            {image ? (
              <Image
                width={400}
                height={400}
                src={image}
                alt="Uploaded"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <>
                <i className="fas fa-upload text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">Drop Image Here</p>
                <p className="text-gray-500">Click to Upload</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <h2 className="text-xl font-medium text-center mb-6">
          Or choose from the closet
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card />
        </div>

        <div className="text-center">
          <Link href="http://localhost:3000/recommendationStyle/results">
            <button className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition">
              Continue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
