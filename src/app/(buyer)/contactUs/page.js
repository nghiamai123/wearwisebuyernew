"use client"

import { Form, Input, Button } from "antd"
import { Collapse } from "antd"
import Image from "next/image"

const { TextArea } = Input

export default function ContactPage() {
  const onFinish = (values) => {
    console.log("Form submitted:", values)
  }

  const faqItems = [
    {
      key: "1",
      label: "How do use the virtual try on feature of Try On 23?",
      children:
        "Simply scan your body using your phone camera, and the system will automatically analyze it and give you proper size suggestions.",
    },
    {
      key: "2",
      label: "How do I track my order?",
      children: "You can track your order in the My Orders section of your profile after logging in.",
    },
    {
      key: "3",
      label: "What payment methods do you accept?",
      children: "We accept credit cards, PayPal, and various digital payment methods.",
    },
    {
      key: "4",
      label: "What is your return policy?",
      children: "We offer a 30-day return policy for unused items in original packaging.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Discover Us Through Connection</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions or need assistance with our virtual try on feature? Reach out to us and discover how we can
          help you find the perfect outfit in your effortlessly, fit&apos;s right, easy, and tailored just for you!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-[#ff7f7f] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
          <Form name="contact" onFinish={onFinish} layout="vertical" className="text-white">
            <Form.Item name="name" rules={[{ required: true, message: "Please input your name!" }]}>
              <Input placeholder="Your name" className="rounded" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Your email" className="rounded" />
            </Form.Item>

            <Form.Item name="message" rules={[{ required: true, message: "Please input your message!" }]}>
              <TextArea placeholder="Your message" rows={4} className="rounded" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-white text-[#ff7f7f] hover:bg-gray-100 border-none rounded w-full"
              >
                Send Message
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0964843000133!2d105.7800432!3d21.0379358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3b4220c2bd%3A0x1c9e359e2a4f618c!2sB%C3%A1ch%20Khoa%2C%20Hai%20B%C3%A0%20Tr%C6%B0ng%2C%20Hanoi%2C%20Vietnam!5e0!3m2!1sen!2s!4v1628647912544!5m2!1sen!2s"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <div className="mt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions (FAQ)</h2>
            <Collapse items={faqItems} defaultActiveKey={["1"]} className="bg-white rounded-lg" />
          </div>
          <div className="flex justify-center">
            <Image
              src="/FAQs-amico.png"
              alt="FAQ Illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

