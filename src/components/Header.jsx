"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ShoppingCartOutlined, HeartOutlined, SearchOutlined, MenuOutlined, CloseOutlined } from "@ant-design/icons"
import { FaMicrophone } from "react-icons/fa"
import { useRouter, usePathname } from "next/navigation"
import { useNotification } from "@/apiServices/NotificationService"

let searchTimeout

export default function Header() {
  const router = useRouter()
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(3)
  const [userImage, setUserImage] = useState("https://placehold.co/100x100")
  const [isListening, setIsListening] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const notify = useNotification()

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = "en-US"
    recognition.start()
    setIsListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setSearchValue(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
    }
  }

  const pathname = usePathname()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    setIsLoggedIn(!!accessToken)

    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    const avatar = localStorage.getItem("avatar") || null

    if (userData && (userData.avatar || avatar)) {
      setUserImage(avatar ? avatar : userData.avatar)
    }

    // Add event listener for avatar updates
    const handleAvatarUpdate = () => {
      const newAvatar = localStorage.getItem("avatar")
      if (newAvatar) {
        setUserImage(newAvatar)
      }
    }

    // Listen for the custom avatar updated event
    window.addEventListener("avatarUpdated", handleAvatarUpdate)

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate)
    }
  }, [])

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("Access token không tồn tại.")
        return
      }

      const response = await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.ok) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
        localStorage.removeItem("avatar")
        notify("Logout", "Logout Successful.", "topRight", "success")
        setIsLoggedIn(false)
        window.location.href = "/"
      } else {
        const errorData = await response.json()
        console.error("Đăng xuất thất bại:", errorData.message || "Lỗi không xác định.")
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error)
    }
  }

  const isActive = (path) => pathname === path

  useEffect(() => {
    if (isSearchVisible) {
      searchTimeout = setTimeout(() => setIsSearchVisible(false), 2000)
    }
    return () => clearTimeout(searchTimeout)
  }, [isSearchVisible])

  const handleFocus = () => {
    clearTimeout(searchTimeout)
  }

  const handleBlur = () => {
    searchTimeout = setTimeout(() => setIsSearchVisible(false), 2000)
  }

  const handleSearch = async (event) => {
    event.preventDefault()

    if (!searchValue.trim()) {
      notify("Search", "Please enter a keyword to search.", "topRight", "warning")
      return
    }

    router.push(`/products?search=${encodeURIComponent(searchValue)}`)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="relative bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-baseline">
              <span className="text-2xl md:text-3xl font-bold text-red-600">W</span>
              <span className="text-lg md:text-xl font-bold text-black">EARWISE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-base lg:text-lg">
            <NavLink href="/" label="Home" activePath={isActive("/")} />
            <NavLink href="/products" label="Products" activePath={isActive("/products/*")} />
            <NavLink href="/contactUs" label="Contact Us" activePath={isActive("/contactUs")} />
            <NavLink href="/tryOn" label="Try On" activePath={isActive("/tryOn")} />
            <div className="nav-link-container relative">
              <NavLink href="/tryOnK" label="Try On" activePath={isActive("/tryOnK")} />
              <span className="absolute -top-2 -right-6 bg-red-600 text-white text-xs px-1 rounded">New</span>
            </div>
          </nav>

          {/* Desktop Search and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64 lg:w-72">
              <SearchOutlined
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={handleSearch}
              />
              <form onSubmit={handleSearch}>
                <input
                  className="w-full py-1 pl-10 pr-10 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  type="text"
                  placeholder="Find my products"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </form>
              <FaMicrophone
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                  isListening ? "text-green-600" : "text-pink-500"
                }`}
                onClick={startListening}
              />
            </div>

            {/* User Actions */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Wishlist with Badge */}
                <div className="relative">
                  <Link href="/profile?tab=wishlist" className="text-black hover:text-gray-600">
                    <HeartOutlined className="text-xl" />
                  </Link>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>

                {/* Cart with Badge */}
                <div className="relative">
                  <Link href="/cart" className="text-black hover:text-gray-600">
                    <ShoppingCartOutlined className="text-xl" />
                  </Link>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* User Avatar + Dropdown */}
                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)} className="focus:outline-none">
                    <img
                      src={userImage || "/placeholder.svg"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-red-500 transition duration-300"
                    />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-10">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-black hover:text-gray-600">
                  Login
                </Link>
                <Link href="/register" className="text-black hover:text-gray-600">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Search Icon */}
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <SearchOutlined className="text-xl" />
            </button>

            {/* Mobile Cart Icon with Badge */}
            <div className="relative">
              <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCartOutlined className="text-xl" />
              </Link>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
              {mobileMenuOpen ? <CloseOutlined className="text-xl" /> : <MenuOutlined className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar - Conditionally Rendered */}
        {isSearchVisible && (
          <div className="md:hidden pb-4 px-2">
            <div className="relative">
              <SearchOutlined
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={handleSearch}
              />
              <form onSubmit={handleSearch}>
                <input
                  className="w-full py-2 pl-10 pr-10 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  type="text"
                  placeholder="Find my products"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </form>
              <FaMicrophone
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
                  isListening ? "text-green-600" : "text-pink-500"
                }`}
                onClick={startListening}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 pt-16">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-4 text-lg">
                <MobileNavLink href="/" label="Home" activePath={isActive("/")} onClick={closeMobileMenu} />
                <MobileNavLink
                  href="/products"
                  label="Products"
                  activePath={isActive("/products/*")}
                  onClick={closeMobileMenu}
                />
                <MobileNavLink
                  href="/contactUs"
                  label="Contact Us"
                  activePath={isActive("/contactUs")}
                  onClick={closeMobileMenu}
                />
                <MobileNavLink href="/tryOn" label="Try On" activePath={isActive("/tryOn")} onClick={closeMobileMenu} />
                <div className="flex items-center">
                  <MobileNavLink
                    href="/tryOnK"
                    label="Try On"
                    activePath={isActive("/tryOnK")}
                    onClick={closeMobileMenu}
                  />
                  <span className="ml-2 bg-red-600 text-white text-xs px-1 rounded">New</span>
                </div>
              </nav>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={userImage || "/placeholder.svg"}
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full border-2 border-gray-300"
                      />
                      <span className="font-medium">My Account</span>
                    </div>
                    <Link
                      href="/profile"
                      className="block py-2 text-gray-700 hover:text-red-600"
                      onClick={closeMobileMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/profile?tab=wishlist"
                      className="block py-2 text-gray-700 hover:text-red-600"
                      onClick={closeMobileMenu}
                    >
                      Wishlist{" "}
                      {wishlistCount > 0 && (
                        <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left py-2 text-gray-700 hover:text-red-600">
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/login"
                      className="block py-2 text-gray-700 hover:text-red-600"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block py-2 text-gray-700 hover:text-red-600"
                      onClick={closeMobileMenu}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Component NavLink for Desktop Navbar
const NavLink = ({ href, label, activePath }) => (
  <Link
    href={href}
    className={`relative text-gray-800 hover:text-red-500 transition-colors duration-300 ${
      activePath ? "font-bold" : ""
    } group`}
  >
    {label}
    <span
      className={`absolute left-0 bottom-0 h-0.5 bg-red-600 transition-all duration-300 ${
        activePath ? "w-full" : "w-0 group-hover:w-full"
      }`}
    ></span>
  </Link>
)

// Component MobileNavLink for Mobile Menu
const MobileNavLink = ({ href, label, activePath, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`text-gray-800 hover:text-red-500 transition-colors duration-300 ${
      activePath ? "font-bold text-red-600" : ""
    }`}
  >
    {label}
  </Link>
)

