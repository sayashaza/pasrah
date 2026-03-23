"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Folders,
  Tags,
  ShoppingCart,
  Users,
  Image as ImageIcon,
} from "lucide-react";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Banners", url: "/banners", icon: ImageIcon },
  { title: "Products", url: "/products", icon: Package },
  { title: "Categories", url: "/categories", icon: Folders },
  { title: "Brands", url: "/brands", icon: Tags },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Customers", url: "/users", icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-primary">BigCart</h1>
        <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary transition-all"
                          : "text-muted-foreground hover:text-foreground transition-all"
                      }
                    >
                      <item.icon className={isActive ? "text-primary" : ""} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="text-xs text-muted-foreground">© 2026 BigCart</div>
      </SidebarFooter>
    </Sidebar>
  );
}
