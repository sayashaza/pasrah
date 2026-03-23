import BannersClient from "@/components/banners-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banners | Admin Dashboard",
  description: "Manage app banners",
};

export default function BannersPage() {
  return <BannersClient />;
}
