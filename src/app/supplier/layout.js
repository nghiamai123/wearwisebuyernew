import { Inter } from "next/font/google";
import "./supplier.css";
import { DataProvider } from "@/Context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dashboard",
  description:
    "Supplier management dashboard for products, orders, and comments",
};

export default function RootLayout({ children }) {
  return <DataProvider>{children}</DataProvider>;
}
