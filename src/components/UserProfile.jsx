"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { viewProfile, updateProfile } from "@/apiServices/users/page"
import { useNotification } from "@/apiServices/NotificationService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export default function UserProfile({ orders = [] }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [avatar, setAvatar] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "male",
    weight: "50",
    height: "170",
    shirt_size: "X",
    pant_size: "28",
    dob: null,
  })
  const [activeTab, setActiveTab] = useState("profile")
  const [formErrors, setFormErrors] = useState({})
  const notify = useNotification()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true)
        const data = await viewProfile()

        if (!data) {
          notify("Failed to load profile", "Please check your connection and try again", "topRight", "error")
          return
        }

        setUser(data)
        if (data) {
          // Set default values for all required fields
          const initialFormData = {
            name: data.name || "",
            phone: data.phone || "",
            address: data.address || "",
            gender: data.gender || "male",
            weight: data.weight || 70, // Default weight
            height: data.height || 170, // Default height (above 100cm)
            shirt_size: data.shirt_size || "M", // Default shirt size
            pant_size: data.pant_size || "32", // Default pant size
            dob: data.dob || null,
          }

          setFormData(initialFormData)

          // Validate all fields
          const errors = {}
          Object.keys(initialFormData).forEach((key) => {
            if (key !== "dob") {
              // Skip dob as it's optional
              const error = validateField(key, initialFormData[key])
              if (error) {
                errors[key] = error
              }
            }
          })

          setFormErrors(errors)

          // Set avatar state if it exists in the user data
          if (data.avatar) {
            setAvatar(data.avatar)
          }
        }
      } catch (error) {
        console.error("Failed to load profile data", error)
        notify("Failed to load profile", "Please try again", "topRight", "error")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserProfile()
  }, [])

  const validateForm = () => {
    const errors = {}

    // Name validation
    if (!formData.name || formData.name.trim() === "") {
      errors.name = "Name is required"
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long"
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Name can only contain letters and spaces"
    }

    // Phone validation
    if (!formData.phone || formData.phone.trim() === "") {
      errors.phone = "Phone number is required"
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits"
    }

    // Address validation
    if (!formData.address || formData.address.trim() === "") {
      errors.address = "Address is required"
    }

    // Gender validation
    if (!formData.gender) {
      errors.gender = "Gender is required"
    }

    // Weight validation
    if (!formData.weight) {
      errors.weight = "Weight is required"
    } else if (formData.weight < 10 || formData.weight > 500) {
      errors.weight = "Weight must be between 10 and 500 kg"
    }

    // Height validation
    if (!formData.height) {
      errors.height = "Height is required"
    } else if (formData.height < 100) {
      errors.height = "Height must be at least 100 cm"
    } else if (formData.height > 250) {
      errors.height = "Height must be less than 250 cm"
    }

    // Shirt size validation
    if (!formData.shirt_size || formData.shirt_size.trim() === "") {
      errors.shirt_size = "Shirt size is required"
    } else if (!/^(S|M|L|XL|XXL)$/.test(formData.shirt_size)) {
      errors.shirt_size = "Shirt size must be S, M, L, XL, or XXL"
    }

    // Pant size validation
    if (!formData.pant_size || formData.pant_size.trim() === "") {
      errors.pant_size = "Pant size is required"
    } else if (!/^(28|30|32|34|36|38|40)$/.test(formData.pant_size)) {
      errors.pant_size = "Pant size must be 28, 30, 32, 34, 36, 38, or 40"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateField = (name, value) => {
    let error = ""

    switch (name) {
      case "name":
        if (!value || value.trim() === "") {
          error = "Name is required"
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters long"
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces"
        }
        break

      case "phone":
        if (!value || value.trim() === "") {
          error = "Phone number is required"
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = "Phone number must be exactly 10 digits"
        }
        break

      case "address":
        if (!value || value.trim() === "") {
          error = "Address is required"
        }
        break

      case "gender":
        if (!value) {
          error = "Gender is required"
        }
        break

      case "weight":
        if (!value) {
          error = "Weight is required"
        } else if (value < 10 || value > 500) {
          error = "Weight must be between 10 and 500 kg"
        }
        break

      case "height":
        if (!value) {
          error = "Height is required"
        } else if (value < 100) {
          error = "Height must be at least 100 cm"
        } else if (value > 250) {
          error = "Height must be less than 250 cm"
        }
        break

      case "shirt_size":
        if (!value || value.trim() === "") {
          error = "Shirt size is required"
        } else if (!/^(S|M|L|XL|XXL)$/.test(value)) {
          error = "Shirt size must be S, M, L, XL, or XXL"
        }
        break

      case "pant_size":
        if (!value || value.trim() === "") {
          error = "Pant size is required"
        } else if (!/^(28|30|32|34|36|38|40)$/.test(value)) {
          error = "Pant size must be 28, 30, 32, 34, 36, 38, or 40"
        }
        break

      default:
        break
    }

    return error
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    const processedValue = type === "number" ? Number.parseFloat(value) : value

    // Update form data
    setFormData({
      ...formData,
      [name]: processedValue,
    })

    // Validate the field and update errors
    const error = validateField(name, processedValue)
    setFormErrors({
      ...formErrors,
      [name]: error,
    })
  }

  // Add this function to handle shirt size input
  const handleShirtSizeChange = (e) => {
    const { name, value } = e.target
    // Convert to uppercase
    const uppercaseValue = value.toUpperCase()

    setFormData({
      ...formData,
      [name]: uppercaseValue,
    })

    // Validate the field and update errors
    const error = validateField(name, uppercaseValue)
    setFormErrors({
      ...formErrors,
      [name]: error,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const formattedData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: user?.email || "",
        weight: formData.weight,
        height: formData.height,
        shirt_size: formData.shirt_size,
        gender: formData.gender,
        pant_size: formData.pant_size,
        role: user.role,
        avatar: avatar || user.avatar, // Use existing avatar if no new one is uploaded
        dob: formData.dob,
      }

      const updatedData = await updateProfile(user.id, formattedData)

      if (!updatedData) {
        notify("Failed to update profile", "Please try again", "topRight", "error")
        return
      }

      setUser({ ...user, ...formattedData })
      setIsEditing(false)
      notify("Your profile has been updated successfully", "", "topRight")
    } catch (error) {
      console.error("Failed to update profile", error)
      notify("Failed to update profile", "Please try again", "topRight", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type and size
    const isImage = file.type.startsWith("image/")
    if (!isImage) {
      notify("You can only upload image files!", "", "topRight", "warning")
      return
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      notify("Image must be smaller than 2MB!", "", "topRight", "warning")
      return
    }

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        notify("Authentication error", "Please log in again", "topRight", "error")
        return
      }

      const response = await fetch(`${BASE_URL}/api/buyer/profile/me`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        console.error("Response is not JSON:", text)
        notify("Upload failed", "Server returned an invalid response", "topRight", "error")
        return
      }

      const data = await response.json()

      if (response.ok) {
        setAvatar(data.avatar_url)

        // Update localStorage with the new avatar URL
        localStorage.setItem("avatar", data.avatar_url)

        // Dispatch a custom event to notify other components about the avatar update
        const avatarUpdateEvent = new Event("avatarUpdated")
        window.dispatchEvent(avatarUpdateEvent)

        notify("Avatar uploaded successfully", "", "topRight", "success")
      } else {
        notify("Upload failed", data.message || "Please try again", "topRight", "error")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      notify("Upload failed", "Please try again", "topRight", "error")
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        gender: user.gender || "male",
        weight: user.weight || 0,
        height: user.height || 0,
        shirt_size: user.shirt_size || "",
        pant_size: user.pant_size || "",
        dob: user.dob || null,
      })
    }
    setIsEditing(false)
    setFormErrors({})
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="p-2 text-gray-600 hover:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
      </div>
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {avatar || user?.avatar ? (
                  <img src={avatar || user?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-50 file:text-gray-700
                    hover:file:bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.name ? "border-red-500" : "border-gray-300"} shadow-sm p-2`}
              />
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm p-2"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength={10}
                className={`mt-1 block w-full rounded-md border ${formErrors.phone ? "border-red-500" : "border-gray-300"} shadow-sm p-2`}
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`mt-1 block w-full rounded-md border ${formErrors.address ? "border-red-500" : "border-gray-300"} shadow-sm p-2`}
              />
              {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <div className="mt-1 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Female</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === "other"}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Other</span>
                </label>
              </div>
              {formErrors.gender && <p className="text-red-500 text-xs mt-1">{formErrors.gender}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  step="0.01"
                  className={`mt-1 block w-full rounded-md border ${formErrors.weight ? "border-red-500" : "border-gray-300"} shadow-sm p-2`}
                />
                {formErrors.weight && <p className="text-red-500 text-xs mt-1">{formErrors.weight}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                  Height (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    step="0.01"
                    min="100"
                    max="250"
                    placeholder="Min: 100 cm"
                    className={`mt-1 block w-full rounded-md border ${formErrors.height ? "border-red-500" : "border-gray-300"} shadow-sm p-2 pr-12`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">cm</span>
                </div>
                {formErrors.height && <p className="text-red-500 text-xs mt-1">{formErrors.height}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="shirt_size" className="block text-sm font-medium text-gray-700">
                  Shirt Size
                </label>
                <input
                  type="text"
                  id="shirt_size"
                  name="shirt_size"
                  value={formData.shirt_size}
                  onChange={handleShirtSizeChange}
                  placeholder="S, M, L, XL, XXL"
                  className={`mt-1 block w-full rounded-md border ${formErrors.shirt_size ? "border-red-500" : "border-gray-300"} shadow-sm p-2`}
                />
                {formErrors.shirt_size && <p className="text-red-500 text-xs mt-1">{formErrors.shirt_size}</p>}
              </div>

              <div className="space-y-1">
                <label htmlFor="pant_size" className="block text-sm font-medium text-gray-700">
                  Pant Size
                </label>
                <select
                  id="pant_size"
                  name="pant_size"
                  value={formData.pant_size}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border ${formErrors.pant_size ? "border-red-500" : "border-gray-300"} shadow-sm p-2`}
                >
                  <option value="">Select pant size</option>
                  <option value="28">28</option>
                  <option value="30">30</option>
                  <option value="32">32</option>
                  <option value="34">34</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                </select>
                {formErrors.pant_size && <p className="text-red-500 text-xs mt-1">{formErrors.pant_size}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        ) : user ? (
          <div>
            <div className="mb-4 border-b">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-2 px-4 ${activeTab === "profile" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-2 px-4 ${activeTab === "orders" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"}`}
                >
                  Order History
                </button>
              </div>
            </div>

            {activeTab === "profile" ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user.avatar || avatar ? (
                      <img src={user.avatar || avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{user.name}</h3>
                    <p className="text-gray-500">{user.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p>{user.phone || "Not provided"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p>{user.address || "Not provided"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p>{user.gender === "male" ? "Male" : user.gender === "female" ? "Female" : "Other"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Weight</p>
                    <p>{user.weight} kg</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Height</p>
                    <p>{user.height} cm</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Shirt Size</p>
                    <p>{user.shirt_size}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Pant Size</p>
                    <p>{user.pant_size}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p>{orders.length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Items
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                                {order.id}
                              </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{dayjs(order.date).format("MM/DD/YYYY")}</td>
                            <td className="px-6 py-4">
                              {order.items
                                .map(
                                  (item) =>
                                    `${item.product_name} x ${item.quantity} ${item.quantity === 1 ? "item" : "items"}`,
                                )
                                .join(", ")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{order.total_amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400 mb-4"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="8" x2="8" y2="8"></line>
                      <line x1="16" y1="12" x2="8" y2="12"></line>
                      <line x1="16" y1="16" x2="8" y2="16"></line>
                    </svg>
                    <h3 className="text-lg font-medium">No Orders Yet</h3>
                    <p className="text-sm text-gray-500 mt-1">You haven't placed any orders.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-500">Loading profile...</p>
          </div>
        )}
      </div>
    </div>
  )
}

