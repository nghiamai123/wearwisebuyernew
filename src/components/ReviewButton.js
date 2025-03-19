"use client"

import { useState } from "react"
import { Button, Rate, Input } from "antd"
import { CheckCircleOutlined } from "@ant-design/icons"

export default function ReviewButton({ itemId, isOpen, onToggle, onReviewSuccess, isReviewed, notify }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const submitReview = async () => {
    if (!rating || !comment) {
      notify("Error", "Please provide both rating and comment", "topRight", "error")
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      notify("Error", "User not authenticated", "topRight", "error")
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_item_id: itemId,
          rating:rating,
          content:comment,
        }),
      })

      if (response.ok) {
        notify("Success", "Review submitted successfully", "topRight", "success")
        setRating(0)
        setComment("")
        // Call the callback to update the parent component
        onReviewSuccess()
      } else {
        notify("Error", "Failed to submit review", "topRight", "error")
      }
    } catch (error) {
      notify("Error", "Something went wrong", "topRight", "error")
    } finally {
      setSubmitting(false)
    }
  }

  // If the item is already reviewed, show a disabled "Reviewed" button
  if (isReviewed) {
    return (
      <Button
        type="default"
        className="ml-auto block text-green-600 border-green-600"
        disabled
        icon={<CheckCircleOutlined />}
      >
        Reviewed
      </Button>
    )
  }

  // If the review form is not open, show the "Write a Review" button
  if (!isOpen) {
    return (
      <Button type="primary" className="bg-blue-500 ml-auto block" onClick={onToggle} size="small">
        Write a Review
      </Button>
    )
  }

  // Otherwise, show the review form
  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      <Rate onChange={setRating} value={rating} />
      <Input.TextArea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a review..."
        className="mt-2"
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button onClick={onToggle}>Cancel</Button>
        <Button type="primary" className="bg-blue-500" onClick={submitReview} loading={submitting}>
          Submit Review
        </Button>
      </div>
    </div>
  )
}

