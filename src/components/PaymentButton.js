"use client"

import { useState } from "react"
import { Button } from "antd"

export default function PaymentButton({ order, notify }) {
  const [isPending, setIsPending] = useState(false)
  const exchangeRate = 25000

  const handlePayment = async () => {
    setIsPending(true)
    const amountVND = Math.round(order.total_amount * exchangeRate)

    if (amountVND < 1000 || amountVND > 50000000) {
      notify("Payment Error", "Amount must be from 1,000 to 50,000,000 VND", "topRight", "error")
      setIsPending(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8000/api/momo/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountVND, orderId: order.id }),
      })
      const data = await response.json()

      if (data.payUrl) {
        window.location.href = data.payUrl
      } else {
        notify("Payment Failed", "Unable to generate payment link", "topRight", "error")
      }
    } catch (error) {
      notify("Payment Error", "Something went wrong", "topRight", "error")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button type="primary" className="bg-pink-500 hover:!bg-pink-600" onClick={handlePayment} disabled={isPending}>
      {isPending ? "Processing..." : "Pay with Momo"}
    </Button>
  )
}

