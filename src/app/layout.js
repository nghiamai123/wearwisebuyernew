// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layouts/LayoutWapper";
import { ProductProvider } from "@/Context/ProductContext";
import { NotificationProvider } from "@/apiServices/NotificationService";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wearwise",
  description: "Ecommerce website for clothing",
};

export default function RootLayout({ children }) {
  return (
    <NotificationProvider>
      <html suppressHydrationWarning lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LayoutWrapper>
            <ProductProvider>{children}</ProductProvider>
          </LayoutWrapper>
        </body>
      </html>
    </NotificationProvider>
  );
}
