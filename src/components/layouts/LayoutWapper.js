"use client";

import { usePathname } from "next/navigation";
import Header from "../Header";
import Container from "../Container";
import AuthLayout from "./AuthLayout";
import Footer from "../Footer";
import Sidebar from "../sidebar";
import { useEffect, useState } from "react";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isSupplierPage = pathname.startsWith("/supplier");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const authImage =
    pathname === "/login"
      ? "/login.png"
      : pathname === "/register"
      ? "/register.png"
      : "/placeholder.png";

  return (
    <>
      {isAuthPage ? (
        <AuthLayout image={authImage}>{children}</AuthLayout>
      ) : isSupplierPage ? (
        <div className="flex min-h-screen">
          <Sidebar />
          <>{children}</>
        </div>
      ) : (
        <>
          <Header />
          <Container>{children}</Container>
          <Footer />
        </>
      )}
    </>
  );
}
