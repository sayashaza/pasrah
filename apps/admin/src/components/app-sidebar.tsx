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
  CalendarDays,
  Warehouse,
  BarChart3,
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

const gpmItems = [
  { title: "Events", url: "/gpm/events", icon: CalendarDays },
  { title: "Stocks", url: "/gpm/stocks", icon: Warehouse },
  { title: "Reports", url: "/gpm/reports", icon: BarChart3 },
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
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-orange-500">🌾 GPM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {gpmItems.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-orange-50 text-orange-600 font-medium hover:bg-orange-50 hover:text-orange-600 transition-all"
                          : "text-muted-foreground hover:text-foreground transition-all"
                      }
                    >
                      <item.icon className={isActive ? "text-orange-500" : ""} />
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
