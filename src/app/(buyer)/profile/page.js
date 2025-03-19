"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { getUserOrders } from "@/apiServices/orders/page";
import { getUserWishlists } from "@/apiServices/wishlists/page";
import { useNotification } from "@/apiServices/NotificationService";
import { useRouter, useSearchParams } from "next/navigation";
import OrdersList from "@/components/OrdersList";
import UserProfile from "@/components/UserProfile";
import WishlistItems from "@/components/WishlistItem";

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [selectedTab, setSelectedTab] = useState(tabParam || "orders");
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const notify = useNotification();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.id);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const resultCode = searchParams.get("resultCode");
    const buy_now_product = localStorage.getItem("buy_now_product");
    if (resultCode && resultCode !== "0") {
      if (buy_now_product) {
        router.push("/order/now");
      } else {
        router.push("/cart");
      }
    } else if (resultCode === "0") {
      // Payment success
      notify("success", "Payment successful!");
    }
  }, [searchParams, router, notify]);

  useEffect(() => {
    if (tabParam) {
      setSelectedTab(tabParam);
    }
  }, [tabParam]);

  const fetchOrders = useCallback(async () => {
    if (!userId || selectedTab !== "orders") return;

    setLoadingOrders(true);
    try {
      const data = await getUserOrders(userId);
      // Only update if data has actually changed
      setOrders((prevOrders) => {
        const isDifferent = JSON.stringify(data) !== JSON.stringify(prevOrders);
        return isDifferent ? data : prevOrders;
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  }, [userId, selectedTab]);

  const fetchWishlists = useCallback(async () => {
    if (!userId || selectedTab !== "wishlist") return;

    setLoadingWishlist(true);
    try {
      const data = await getUserWishlists(userId);
      // Only update if data has actually changed
      setWishlistItems((prevItems) => {
        const isDifferent = JSON.stringify(data) !== JSON.stringify(prevItems);
        return isDifferent ? data : prevItems;
      });
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    } finally {
      setLoadingWishlist(false);
    }
  }, [userId, selectedTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const handleTabChange = (e) => {
    setSelectedTab(e.key);
  };

  // Remove the handleRemoveWishlistItem function

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
          <Menu
            mode="inline"
            selectedKeys={[selectedTab]}
            onClick={handleTabChange}
            className="border-0"
            items={[
              { key: "orders", icon: <ShoppingOutlined />, label: "My Orders" },
              {
                key: "wishlist",
                icon: <HeartOutlined />,
                label: "My Wishlists",
              },
              {
                key: "profile",
                icon: <UserOutlined />,
                label: "My Profile",
              },
            ]}
          />
        </div>

        <div className="space-y-6">
          {selectedTab === "orders" && (
            <OrdersList
              orders={orders}
              loading={loadingOrders}
              notify={notify}
            />
          )}

          {selectedTab === "wishlist" && (
            <WishlistItems
              wishlistItems={wishlistItems}
              loading={loadingWishlist}
              notify={notify}
              onRefresh={fetchWishlists} // Pass only the refresh function
            />
          )}

          {selectedTab === "profile" && user && (
            <UserProfile user={user} orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
}
