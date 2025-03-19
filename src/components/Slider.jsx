"use client"
import { Button, Badge, Select, Card, Typography, Space, Tooltip, Rate } from "antd"
import { ShoppingCartOutlined, HeartOutlined, EyeOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const { Title, Text, Paragraph } = Typography
const { Option } = Select

export default function Slider() {
  const [angle, setAngle] = useState(0)
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("pink")
  const [hoveredProduct, setHoveredProduct] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 0.5) % 360)
    }, 50)

    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const calculatePosition = (offsetAngle, radius) => {
    // Use smaller radius on mobile
    const adjustedRadius = isMobile ? radius * 0.6 : radius

    const totalAngle = (angle + offsetAngle) % 360
    const radian = (totalAngle * Math.PI) / 180
    const x = Math.cos(radian) * adjustedRadius
    const y = Math.sin(radian) * adjustedRadius
    return { x, y }
  }

  const floatingAnimation = (delay) => {
    const floatY = Math.sin((angle + delay) * 0.05) * 10
    return floatY
  }

  const renderProduct = (product, offsetAngle, radius, delay, size = "w-32") => {
    const { x, y } = calculatePosition(offsetAngle, radius)
    const floatY = floatingAnimation(delay)
    const isHovered = hoveredProduct === product.title

    // Smaller cards on mobile
    const cardWidth = isMobile ? (isHovered ? 100 : 80) : isHovered ? 150 : 130
    const imageHeight = isMobile ? (isHovered ? 100 : 80) : isHovered ? 150 : 130

    return (
      <div
        key={product.title}
        style={{
          position: "absolute",
          transform: `translate(${x}px, ${y}px) translateY(${floatY}px)`,
          transition: "transform 0.3s ease-out, scale 0.3s ease-out",
          scale: isHovered ? "1.1" : "1",
          zIndex: isHovered ? 20 : 5,
        }}
        onMouseEnter={() => setHoveredProduct(product.title)}
        onMouseLeave={() => setHoveredProduct(null)}
      >
        <Card
          hoverable
          style={{
            width: cardWidth,
            padding: 0,
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: isHovered ? "0 8px 16px rgba(0,0,0,0.1)" : "0 4px 8px rgba(0,0,0,0.05)",
          }}
          styles={{
            body: { padding: isHovered ? "8px" : "4px" },
          }}
          cover={
            <div style={{ position: "relative", height: imageHeight }}>
              <Image
                width={cardWidth}
                height={imageHeight}
                src={product.src || "/placeholder.svg"}
                alt={product.alt}
                style={{ objectFit: "contain", transition: "all 0.3s ease" }}
              />
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "4px",
                    background: "rgba(255,255,255,0.8)",
                  }}
                >
                  <Tooltip title="Add to cart">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<ShoppingCartOutlined />}
                      size="small"
                      style={{ background: "#e11d48" }}
                    />
                  </Tooltip>
                  <Tooltip title="Add to wishlist">
                    <Button shape="circle" icon={<HeartOutlined />} size="small" />
                  </Tooltip>
                  <Tooltip title="Quick view">
                    <Button shape="circle" icon={<EyeOutlined />} size="small" />
                  </Tooltip>
                </div>
              )}
              {product.discount && (
                <Badge
                  count={`-${product.discount}%`}
                  style={{
                    background: "#e11d48",
                    position: "absolute",
                    top: 5,
                    right: 5,
                  }}
                />
              )}
            </div>
          }
        >
          <div style={{ textAlign: "center" }}>
            <Text
              strong
              style={{
                fontSize: isMobile ? "10px" : isHovered ? "14px" : "12px",
                display: "block",
                marginBottom: "2px",
              }}
            >
              {product.title}
            </Text>
            {isHovered && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "4px",
                  }}
                >
                  <Rate disabled defaultValue={product.rating || 4} style={{ fontSize: isMobile ? "10px" : "12px" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px",
                  }}
                >
                  {product.oldPrice && (
                    <Text delete type="secondary" style={{ fontSize: isMobile ? "10px" : "12px" }}>
                      ${product.oldPrice}
                    </Text>
                  )}
                  <Text type="danger" strong style={{ fontSize: isMobile ? "12px" : "14px" }}>
                    ${product.price}
                  </Text>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    )
  }

  const products = [
    {
      src: "/image-10.2-removebg-preview.png",
      alt: "Cardigan",
      title: "Cardigan",
      angle: 0,
      radius: 180,
      delay: 0,
      price: 49.99,
      oldPrice: 69.99,
      discount: 30,
      rating: 4.5,
    },
    {
      src: "/vay.jpg",
      alt: "Dress",
      title: "Dress",
      angle: 72,
      radius: 180,
      delay: 500,
      price: 39.99,
      rating: 4,
    },
    {
      src: "/skirt.jpg",
      alt: "Skirt",
      title: "Skirt",
      angle: 144,
      radius: 180,
      delay: 1000,
      price: 59.99,
      oldPrice: 79.99,
      discount: 25,
      rating: 5,
    },
    {
      src: "/jeann.webp",
      alt: "Jean",
      title: "Jean",
      angle: 216,
      radius: 180,
      delay: 1500,
      price: 45.99,
      rating: 4,
    },
    {
      src: "/shose.webp",
      alt: "Blouse",
      title: "Blouse",
      angle: 288,
      radius: 180,
      delay: 4000,
      price: 89.99,
      rating: 4.5,
    },
  ]

  return (
    <div className="bg-[#FDCBD5] flex items-center justify-center min-h-screen w-full">
      <div className="container mx-auto px-4 md:px-20 flex flex-col md:flex-row items-center">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="text-center md:text-left md:w-1/2 mb-8 md:mb-0">
            <Title
              level={1}
              style={{
                fontSize: isMobile ? "2.5rem" : "3.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                lineHeight: 1.2,
              }}
            >
              Elevate Your Style <span style={{ color: "#e11d48" }}>Virtually</span>
            </Title>
            <Paragraph
              style={{
                fontSize: isMobile ? "1.2rem" : "1.5rem",
                color: "#4b5563",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Experience our revolutionary virtual try-on technology. See how our latest collection looks on you before
              making a purchase.
            </Paragraph>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Space wrap>
                <Link href="/tryOn">
                  <Button
                    type="primary"
                    size="large"
                    icon={<EyeOutlined />}
                    style={{
                      background: "#e11d48",
                      height: isMobile ? "40px" : "48px",
                      padding: "0 24px",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    Try Now
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      height: isMobile ? "40px" : "48px",
                      padding: "0 24px",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    Browse Collection
                  </Button>
                </Link>
              </Space>
            </Space>
          </div>
        </div>

        <div className="relative md:w-1/2 flex justify-center items-center h-[500px] md:h-[600px]">
          {products.map((product) => renderProduct(product, product.angle, product.radius, product.delay))}

          <div
            style={{
              position: "relative",
              zIndex: 10,
              transform: `translateY(${floatingAnimation(2000)}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="relative flex justify-center items-center">
              {/* Hình ảnh hologram */}
              <div className="hologram">
                <Image
                  width={isMobile ? 160 : 220}
                  height={isMobile ? 320 : 420}
                  src="/image10-removebg-preview.png"
                  alt="Hologram Model"
                  className="object-contain"
                  style={{
                    width: isMobile ? "160px" : "220px",
                    height: isMobile ? "320px" : "420px",
                  }}
                />
                <div className="scanline"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

