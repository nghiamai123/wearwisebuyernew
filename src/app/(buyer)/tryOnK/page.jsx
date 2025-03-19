"use client"

import { useState, useEffect } from "react"
import { Upload, Button, Row, Col, Card, Typography, Spin, Alert, Tabs, List, Space, Divider } from "antd"
import { UploadOutlined, InboxOutlined, LoadingOutlined } from "@ant-design/icons"
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from "@ant-design/icons"
import { DeleteOutlined, SwapOutlined } from "@ant-design/icons"
import styles from "./page.module.css"
import { useNotification } from "@/apiServices/NotificationService"
import { tryOnKlingAI, getKlingAIResults } from "@/apiServices/tryOnK/page"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

const { Text, Title, Paragraph } = Typography
const { Dragger } = Upload
// Sample data for examples
const personExamples = [
  "https://www.newtheoryclothing.com/cdn/shop/files/1_15be3c0e-66d7-4068-a7d0-7cc5463caa16.png?v=1690888546",
  "https://skinoutfits.com/wp-content/uploads/2023/08/Jensen-Huang-Nvidia-CEO-Black-Biker-Leather-Jacket-Online-At-Superstar-Jackets-3.jpg",
  "https://cdn.24h.com.vn/upload/1-2021/images/2021-03-12/Phat-hien-nguoi-dep-157884103_540208743608984_4158627500730650223_n-1615519993-786-width1080height1349.jpg",
  "https://danviet.mediacdn.vn/upload/3-2019/images/2019-09-04/3-1567585403-width650height651.jpg",
]

const garmentExamples = [
  "https://timshop.timhortons.ca/cdn/shop/files/retro-logo-tshirt-back-1000px.png?v=1707853862&width=1000",
  "https://media.istockphoto.com/id/1152838910/vi/anh/blazer-nam-m%C3%A0u-xanh-%C4%91%E1%BA%ADm-tr%C3%AAn-n%E1%BB%81n-c%C3%B4-l%E1%BA%ADp.jpg?s=612x612&w=0&k=20&c=E1U6Q5jRmtEoC0VorvlVFENFqhfajobXJLWZp4M8Nrc=",
  "https://product.hstatic.net/200000690725/product/ewcw001_54058105257_o_8e31ef77217942c5a8e31a0738d2c495_master.jpg",
  "https://bizweb.dktcdn.net/thumb/1024x1024/100/366/518/products/ao-day3.jpg",
]

export default function Home() {
  const [personImage, setPersonImage] = useState(null)
  const [garmentImage, setGarmentImage] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [BuyNowWithTryOn, setBuyNowWithTryOn] = useState(false)
  const notify = useNotification()
  const route = useRouter()

  // Responsive breakpoints
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)")

  useEffect(() => {
    const storedGarmentImage = localStorage.getItem("tryOnImage")
    const BuyNowWithTryOn = localStorage.getItem("BuyNowWithTryOn")
    if (storedGarmentImage) {
      setGarmentImage(storedGarmentImage)
      setBuyNowWithTryOn(BuyNowWithTryOn)
      localStorage.removeItem("tryOnImage")
    }
  }, [])

  const items = [
    {
      key: "step1",
      label: <Text style={{ fontSize: isMobile ? "16px" : "18px" }}>Step 1: Model Image</Text>,
      children: (
        <Card
          title={
            <Title level={3} style={{ fontSize: isMobile ? "16px" : "18px" }}>
              Upload Model Image
            </Title>
          }
          extra={isMobile ? null : <Text style={{ fontSize: "16px" }}>Follow these guidelines for best results</Text>}
          variant="outlined"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: "#52c41a", fontSize: isMobile ? "18px" : "20px" }}>
                Recommended
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Clear single-person photo",
                  "Full body or half-body shot",
                  "Unobstructed clothing on the model",
                  "Simple pose",
                  "Model wearing simple, fitted clothing",
                  "Obstructed model's face is acceptable",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CheckCircleFilled style={{ color: "#52c41a" }} />
                      <Text style={{ fontSize: isMobile ? "14px" : "16px" }}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: "#f5222d", fontSize: isMobile ? "18px" : "20px" }}>
                Not Recommended
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Group photos",
                  "Leaning or seated poses",
                  "Obstructed clothing areas (by hands, hair, etc.)",
                  "Complex poses",
                  "Model wearing bulky clothing",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CloseCircleFilled style={{ color: "#f5222d" }} />
                      <Text style={{ fontSize: isMobile ? "14px" : "16px" }}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: "step2",
      label: <Text style={{ fontSize: isMobile ? "16px" : "18px" }}>Step 2: Product Image</Text>,
      children: (
        <Card
          title={
            <Title level={3} style={{ fontSize: isMobile ? "16px" : "18px" }}>
              Upload Product Image
            </Title>
          }
          extra={isMobile ? null : <Text style={{ fontSize: "16px" }}>Follow these guidelines for best results</Text>}
          variant="outlined"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: "#52c41a", fontSize: isMobile ? "18px" : "20px" }}>
                Recommended
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Single clothing item",
                  "White background flat lay",
                  "Simple and clear clothing details",
                  "Focus on the garment as the main subject",
                  "Clear and unobstructed clothing",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CheckCircleFilled style={{ color: "#52c41a" }} />
                      <Text style={{ fontSize: isMobile ? "14px" : "16px" }}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <Title level={4} style={{ color: "#f5222d", fontSize: isMobile ? "18px" : "20px" }}>
                Not Recommended
              </Title>
              <List
                itemLayout="horizontal"
                dataSource={[
                  "Multiple clothing items in a single image",
                  "Only bottom wear",
                  "Complex backgrounds",
                  "Clothing with intricate patterns or prints",
                  "Additional floating watermarks",
                  "Clothing that is folded or obscured",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <CloseCircleFilled style={{ color: "#f5222d" }} />
                      <Text style={{ fontSize: isMobile ? "14px" : "16px" }}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: "step3",
      label: <Text style={{ fontSize: isMobile ? "16px" : "18px" }}>Step 3: Results</Text>,
      children: (
        <Card
          title={
            <Title level={3} style={{ fontSize: isMobile ? "18px" : "20px" }}>
              Generated Results
            </Title>
          }
          extra={isMobile ? null : <Text style={{ fontSize: "16px" }}>What to expect after uploading your images</Text>}
          variant="outlined"
        >
          <Paragraph style={{ fontSize: isMobile ? "14px" : "16px" }}>
            After uploading compliant product and model images, wait 40-50 seconds to receive your virtual try-on
            result.
          </Paragraph>
          <Divider orientation="left">Example Results</Divider>
          <Row gutter={[16, 16]}>
            {["Model Image", "Product Image", "Try-on Result"].map((title, index) => (
              <Col xs={24} sm={8} key={index}>
                <Card variant="outlined" className="result-card">
                  <Title level={5} style={{ textAlign: "center", marginBottom: "16px" }}>
                    {title}
                  </Title>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={`/${index === 0 ? "008.jpg" : index === 1 ? "02_upper.png" : "Cl6-G2fK.png"}?height=300&width=200`}
                      alt={`${title} example`}
                      style={{ maxWidth: "100%", height: "auto", border: "1px solid #f0f0f0" }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Card type="inner" title="Available Features" style={{ marginTop: "24px" }} variant="outlined">
            <List
              itemLayout="horizontal"
              dataSource={[
                "Image quality enhancement and background preservation",
                "Multiple export options including high-resolution images",
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Text style={{ fontSize: isMobile ? "14px" : "15px" }}>{item}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Card>
      ),
    },
  ]

  const validationImage = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
    if (!allowedTypes.includes(file.type)) {
      notify("Invalid file type. Only JPG, JPEG, and PNG are supported.", "", "topRight", "error")
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("File size exceeds 5MB limit.", "", "topRight", "error")
      return false
    }

    if (!file) {
      notify("No file selected", "", "topRight", "error")
      return false
    }
    return true
  }

  const handlePersonUpload = (info) => {
    const file = info.file.originFileObj

    if (validationImage(file)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setPersonImage(reader.result)
        setResultImage(null)
      }
    }
  }

  const handleGarmentUpload = (info) => {
    const file = info.file.originFileObj
    if (validationImage(file)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setGarmentImage(reader.result)
        setResultImage(null)
      }
    }
  }

  // New function to handle file uploads from input elements
  const handleImageUpload = (e, setImageFunction) => {
    const file = e.target.files[0]
    if (file && validationImage(file)) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImageFunction(reader.result)
        setResultImage(null)
      }
    }
  }

  // Fixed function to handle image deletion with event stopping
  const handleDeleteImage = (e, setImageFunction) => {
    e.stopPropagation() // Stop event propagation to prevent Dragger from opening file dialog
    setImageFunction(null)
    setResultImage(null)
  }

  async function submitTryOn() {
    const personFile = personImage
    const garmentFile = garmentImage

    if (!personFile || !garmentFile) {
      notify("Error", "Please upload both images!", "topRight", "error")
      return
    }

    // Start loading animation
    setIsLoading(true)
    setLoadingProgress(0)

    // Start progress animation
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        // Increase progress up to 95% (save the last 5% for actual completion)
        const newProgress = prev + (95 - prev) * 0.1
        return newProgress > 95 ? 95 : newProgress
      })
    }, 1000)

    try {
      const personBase64 = await convertToBase64(personFile)
      const garmentBase64 = await convertToBase64(garmentFile)

      if (personBase64 && garmentBase64) {
        const response = await tryOnKlingAI({
          human_image: personBase64,
          cloth_image: garmentBase64,
        })
        console.log(response)
        const result = response

        if (!result) {
          clearInterval(progressInterval)
          setIsLoading(false)

          // Added default values to prevent errors
          const errorMessage = "Failed to process request"
          const errorCode = "Unknown"
          const requestId = result?.original?.data?.request_id || "No request ID"
          const taskId = result?.original?.data?.task_id || "No task ID"

          notify(
            "Error Occurred",
            `Message: ${errorMessage}\nCode: ${errorCode}\nRequest ID: ${requestId} \nTask ID: ${taskId}`,
            "topRight",
            "error",
          )
          console.error("Error Details:", {
            requestId: requestId,
            token: result?.original?.token ? "Token received" : "No token",
          })
          if (errorCode === 1002) {
            console.warn("Authentication failed! Redirecting to login...")
          }
          return
        }

        console.log(result?.original?.data?.data?.task_id)

        const taskId = result?.original?.data?.data?.task_id

        if (taskId && result.original.token) {
          // Check the result every second until it's done or fails
          console.log(taskId, result.original.token)
          await checkTryOnResult(taskId, result.original.token, progressInterval)
          return
        }

        clearInterval(progressInterval)
        setIsLoading(false)
        notify("Error Occurred", "Failed to retrieve try-on result. Please try again.", "topRight", "error")
        console.error("Failed to retrieve try-on result.")
        return
      }
    } catch (error) {
      clearInterval(progressInterval)
      setIsLoading(false)
      notify("Error Occurred", "An unexpected error happened. Please try again.", "topRight", "error")
      console.error("Error in submitTryOn:", error)
    }
  }

  async function checkTryOnResult(taskId, token, progressInterval) {
    try {
      const result = await getKlingAIResults(taskId, token)

      if (result.data?.task_status === "failed") {
        clearInterval(progressInterval)
        setIsLoading(false)
        notify("Error", `${result.data?.message || "Unknown failure reason"}`, "topRight", "error")
        console.log(result)
        return
      }

      // If we have a successful result
      if (result.data?.task_status === "succeed") {
        // Set progress to 100% and show result
        setLoadingProgress(100)
        setTimeout(() => {
          setResultImage(result.data.task_result.images[0].url)
          setIsLoading(false)
          clearInterval(progressInterval)
        }, 500) // Short delay to show 100% completion
        return
      }

      // If still processing, check again after a delay
      setTimeout(() => checkTryOnResult(taskId, token, progressInterval), 2000)
    } catch (error) {
      clearInterval(progressInterval)
      setIsLoading(false)
      notify("Request Error", "Failed to check try-on result status.", "topRight", "error")
      console.error("Error checking result:", error)
    }
  }

  async function convertToBase64(input) {
    return new Promise((resolve, reject) => {
      if (input instanceof File) {
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result.split(",")[1]
          resolve(base64String)
        }
        reader.onerror = (error) => {
          console.error("Error reading file:", error)
          reject(error)
        }
        reader.readAsDataURL(input)
      } else if (typeof input === "string") {
        const base64Match = input.match(/^data:image\/[a-zA-Z]+;base64,(.*)$/)
        resolve(base64Match ? base64Match[1] : input)
      } else {
        reject("Invalid input type")
      }
    })
  }

  const selectPersonExample = (index) => {
    setPersonImage(personExamples[index])
  }

  const selectGarmentExample = (index) => {
    setGarmentImage(garmentExamples[index])
  }

  return (
    <main className={styles.main}>
      <Row gutter={[16, 16]} className={styles.stepsRow}>
        <Col xs={24} md={8}>
          <Card
            className={styles.card}
            title={
              <div className={styles.stepTitle}>
                Step 1. Upload a person Image <span className={styles.infoIcon}>ℹ️</span>
              </div>
            }
          >
            <Dragger
              name="personImage"
              showUploadList={false}
              onChange={handlePersonUpload}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok")
                }, 0)
              }}
              className={styles.uploader}
            >
              {personImage ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleDeleteImage(e, setPersonImage)}
                      title="Remove image"
                      type="button"
                    >
                      <DeleteOutlined className="text-red-500 text-lg" />
                    </button>
                    <label
                      htmlFor="person-upload-change"
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Change image"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SwapOutlined className="text-blue-500 text-lg" />
                    </label>
                  </div>
                  <img
                    width={200}
                    height={300}
                    src={personImage || "/placeholder.svg"}
                    alt="Person"
                    className={`${styles.uploadedImage}`}
                  />
                  <input
                    type="file"
                    className="hidden"
                    id="person-upload-change"
                    onChange={(e) => handleImageUpload(e, setPersonImage)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className={styles.uploadContent}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className={styles.uploadText}>Drop Image Here</p>
                  <p className={styles.uploadOr}>or</p>
                  <p className={styles.uploadClick}>Click to Upload</p>
                </div>
              )}
            </Dragger>

            <div className={styles.examplesSection}>
              <Text className={styles.examplesTitle}>Examples</Text>
              <div className={styles.examplesGrid}>
                {personExamples.map((example, index) => (
                  <div
                    key={`person-${index}`}
                    className={styles.exampleItem}
                    onClick={() => selectPersonExample(index)}
                  >
                    <img src={example || "/placeholder.svg"} alt={`Person example ${index}`} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            className={styles.card}
            title={
              <div className={styles.stepTitle}>
                Step 2. Upload a garment image <span className={styles.infoIcon}>ℹ️</span>
              </div>
            }
          >
            <Dragger
              name="garmentImage"
              showUploadList={false}
              onChange={handleGarmentUpload}
              customRequest={({ onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok")
                }, 0)
              }}
              className={styles.uploader}
            >
              {garmentImage ? (
                <div className="relative">
                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      onClick={(e) => handleDeleteImage(e, setGarmentImage)}
                      title="Remove image"
                      type="button"
                    >
                      <DeleteOutlined className="text-red-500 text-lg" />
                    </button>
                    <label
                      htmlFor="garment-upload-change"
                      className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Change image"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SwapOutlined className="text-blue-500 text-lg" />
                    </label>
                  </div>
                  <img
                    width={200}
                    height={300}
                    src={garmentImage || "/placeholder.svg"}
                    alt="Garment"
                    className={styles.uploadedImage}
                  />
                  <input
                    type="file"
                    className="hidden"
                    id="garment-upload-change"
                    onChange={(e) => handleImageUpload(e, setGarmentImage)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ) : (
                <div className={styles.uploadContent}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className={styles.uploadText}>Drop Image Here</p>
                  <p className={styles.uploadOr}>or</p>
                  <p className={styles.uploadClick}>Click to Upload</p>
                </div>
              )}
            </Dragger>

            <div className={styles.examplesSection}>
              <Text className={styles.examplesTitle}>Examples</Text>
              <div className={styles.examplesGrid}>
                {garmentExamples.map((example, index) => (
                  <div
                    key={`garment-${index}`}
                    className={styles.exampleItem}
                    onClick={() => selectGarmentExample(index)}
                  >
                    <img src={example || "/placeholder.svg"} alt={`Garment example ${index}`} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            className={styles.card}
            title={<div className={styles.stepTitle}>Step 3. Press "Run" to get try-on results</div>}
          >
            <div className={styles.uploader}>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${loadingProgress}%` }}></div>
                  </div>
                  <p className={styles.loadingText}>Processing... {Math.round(loadingProgress)}%</p>
                </div>
              ) : resultImage ? (
                <img src={resultImage || "/placeholder.svg"} alt="Result" className={styles.uploadedImage} />
              ) : (
                <div className={styles.emptyResult}>
                  <InboxOutlined style={{ fontSize: 48 }} />
                </div>
              )}
            </div>

            <Card className={styles.seedCard}>
              <div className={styles.runButtonContainer}>
                <Button
                  type="primary"
                  onClick={() => submitTryOn()}
                  className={styles.runButton}
                  disabled={!personImage || !garmentImage || isLoading}
                  loading={isLoading}
                >
                  {isLoading ? "Processing..." : "Run"}
                </Button>

                {/* Kiểm tra nếu cả resultImage và BuyNowWithTryOn có giá trị hợp lệ */}
                {resultImage && BuyNowWithTryOn && (
                  <Button
                    className={`${styles.runButton} mt-2`}
                    type="primary"
                    onClick={() => route.push("/order/now")}
                  >
                    Buy Now
                  </Button>
                )}
              </div>
            </Card>
          </Card>
        </Col>
      </Row>

      <Tabs items={items} />

      <section style={{ marginBottom: "30px" }}>
        <Title level={3} style={{ fontSize: isMobile ? "20px" : "22px" }}>
          Tips for Best Results
        </Title>
        <Alert
          message={<Text style={{ fontSize: isMobile ? "16px" : "18px" }}>Note</Text>}
          description={
            <Text style={{ fontSize: isMobile ? "14px" : "16px" }}>
              Discrepancies may occur in clothing details, especially with small text and logos. This is a common
              challenge in virtual try-on technology that we're continuously working to improve.
            </Text>
          }
          type="info"
          showIcon
          icon={<InfoCircleFilled />}
          style={{ marginBottom: "22px" }}
        />
      </section>
    </main>
  )
}

