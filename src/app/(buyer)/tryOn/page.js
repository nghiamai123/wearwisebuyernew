"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  UploadOutlined,
  UserOutlined,
  PictureOutlined,
  ReloadOutlined,
  DeleteOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { FaTshirt } from "react-icons/fa";

export default function TryOn2D() {
  const [personImage, setPersonImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const storedGarmentImage = localStorage.getItem("tryOnImage");
    if (storedGarmentImage) {
      setGarmentImage(storedGarmentImage);
      localStorage.removeItem("tryOnImage");
    }
  }, []);

  // const getFileNameFromUrl = (url) => {
  //   const parts = url.split("/");
  //   let filename = parts[parts.length - 1];

  //   const queryIndex = filename.indexOf("?");
  //   if (queryIndex !== -1) {
  //     filename = filename.substring(0, queryIndex);
  //   }

  //   return decodeURIComponent(filename);
  // };

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleTryOn2D = async () => {
    if (!personImage || !garmentImage) {
      alert("Please upload both a person image and a garment image!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      // let garmentFile;

      // if (garmentImage.startsWith("http")) {
      //   const response = await fetch(garmentImage);
      //   const blob = await response.blob();
      //   garmentFile = new File([blob], getFileNameFromUrl(garmentImage), {
      //     type: blob.type,
      //   });
      // } else {
      //   garmentFile = dataURLtoFile(garmentImage, "garment.jpg");
        
      // }
      // formData.append("cloth_image", garmentFile);
      formData.append("cloth_image", dataURLtoFile(garmentImage, "garment.jpg"));
      formData.append("person_image", dataURLtoFile(personImage, "person.jpg"));

      const response = await fetch("http://127.0.0.1:8000/api/virtual-tryon", {
        method: "POST",
        body: formData,
        headers: {
          "x-rapidapi-host": "virtual-try-on2.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || ""
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResultImage(data.original.response.ouput_path_img);
    } catch (error) {
      console.error("Error calling API:", error);
      alert("An error occurred while trying on the clothes, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Try On 2D</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Person Image */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">
            Step 1: Upload a person image
          </h2>
          <div className="border-2 border-gray-300 rounded-lg p-4 w-64 h-72 flex flex-col items-center justify-center">
            <div className="flex items-center mb-2">
              <UserOutlined className="text-xl mr-2" />
              <span className="font-semibold">Person</span>
            </div>
            <div className="relative flex flex-col items-center justify-center h-full w-full">
              {personImage ? (
                <>
                  <Image
                    src={personImage || "/placeholder.svg"}
                    alt="Uploaded Person"
                    width={256}
                    height={208}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setPersonImage(null);
                        setResultImage(null);
                      }}
                      title="Remove image"
                    >
                      <DeleteOutlined className="text-red-500 text-lg" />
                    </button>
                    <label
                      htmlFor="person-upload-change"
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Change image"
                    >
                      <SwapOutlined className="text-blue-500 text-lg" />
                    </label>
                    <input
                      type="file"
                      className="hidden"
                      id="person-upload-change"
                      onChange={(e) => handleImageUpload(e, setPersonImage)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <UploadOutlined className="text-2xl mb-2" />
                  <input
                    type="file"
                    className="hidden"
                    id="person-upload"
                    onChange={(e) => handleImageUpload(e, setPersonImage)}
                  />
                  <label
                    htmlFor="person-upload"
                    className="text-center text-gray-500 cursor-pointer"
                  >
                    Drop Image Here
                    <br />- or -<br />
                    Click to Upload
                  </label>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upload Garment Image */}
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">
            Step 2: Upload a garment image
          </h2>
          <div className="border-2 border-gray-300 rounded-lg p-4 w-64 h-72 flex flex-col items-center justify-center">
            <div className="flex items-center mb-2">
              <FaTshirt className="text-xl mr-2" />
              <span className="font-semibold">Garment</span>
            </div>
            <div className="relative flex flex-col items-center justify-center h-full w-full">
              {garmentImage ? (
                <>
                  <Image
                    src={garmentImage || "/placeholder.svg"}
                    alt="Uploaded Garment"
                    width={256}
                    height={208}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        setGarmentImage(null);
                        setResultImage(null);
                      }}
                      title="Remove image"
                    >
                      <DeleteOutlined className="text-red-500 text-lg" />
                    </button>
                    <label
                      htmlFor="garment-upload-change"
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Change image"
                    >
                      <SwapOutlined className="text-blue-500 text-lg" />
                    </label>
                    <input
                      type="file"
                      className="hidden"
                      id="garment-upload-change"
                      onChange={(e) => handleImageUpload(e, setGarmentImage)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <UploadOutlined className="text-2xl mb-2" />
                  <input
                    type="file"
                    className="hidden"
                    id="garment-upload"
                    onChange={(e) => handleImageUpload(e, setGarmentImage)}
                  />
                  <label
                    htmlFor="garment-upload"
                    className="text-center text-gray-500 cursor-pointer"
                  >
                    Drop Image Here
                    <br />- or -<br />
                    Click to Upload
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Display Result */}
      <div className="flex flex-col items-center mt-6">
        <h2 className="text-lg font-semibold mb-2">
          Step 3: Press “Run” to get try-on results
        </h2>
        <div className="border-2 border-gray-300 rounded-lg p-4 w-64 h-72 flex flex-col items-center justify-center">
          <div className="flex items-center mb-2">
            <PictureOutlined className="text-xl mr-2" />
            <span className="font-semibold">Result</span>
          </div>
          {resultImage ? (
            <img
              src={resultImage || "/placeholder.svg"}
              alt="Try-on Result"
              className="object-cover"
              style={{ width: "256px", height: "100%", maxHeight: "208px" }} 
            />
          ) : (
            <p className="text-gray-500">Result will appear here</p>
          )}
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={handleTryOn2D}
        className="mt-6 bg-black text-white py-2 px-6 rounded-full flex items-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <ReloadOutlined className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <UploadOutlined /> Run
          </>
        )}
      </button>
    </div>
  );
}
