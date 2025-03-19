"use client"
import { Tabs } from "antd"
import OrdersByStatus from "./OrderByStatus"


export default function OrdersList({ orders, loading, notify }) {
  return (
    <Tabs
      defaultActiveKey="pending"
      items={[
        {
          key: "pending",
          label: "Pending",
          children: <OrdersByStatus orders={orders} status="pending" loading={loading} notify={notify} />,
        },
        {
          key: "completed",
          label: "Completed",
          children: <OrdersByStatus orders={orders} status="completed" loading={loading} notify={notify} />,
        },
        {
          key: "canceled",
          label: "Canceled",
          children: <OrdersByStatus orders={orders} status="canceled" loading={loading} notify={notify} />,
        },
      ]}
    />
  )
}

