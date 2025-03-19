"use client";

import { useState } from "react";

export default function Home() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/momo/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
      });

      const data = await response.json();

      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert("Lỗi khi tạo thanh toán!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Lỗi kết nối đến server!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Thanh toán MoMo</h2>
      <input
        type="number"
        placeholder="Nhập số tiền"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          backgroundColor: "#e91e63",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Đang xử lý..." : "Thanh toán MoMo"}
      </button>
    </div>
  );
}
