import { LayoutDashboard, TrendingUp, Droplets, Table2, FileText, Bot, Network, Calculator, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Portfolio Overview", url: "/", icon: LayoutDashboard },
  { title: "Holdings & Performance", url: "/performance", icon: TrendingUp },
  { title: "Liquidity", url: "/liquidity", icon: Droplets },
  { title: "Manager Grid", url: "/managers", icon: Table2 },
  { title: "Manager Detail", url: "/manager/4", icon: FileText },
  { title: "Tax Intelligence", url: "/tax-intelligence", icon: Calculator },
  { title: "Analyst & Personas", url: "/analyst", icon: Bot },
  { title: "Interconnection Map", url: "/connections", icon: Network },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-primary gold-glow">AltBots</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Portfolio Monitor</p>
              <p className="text-[9px] text-muted-foreground/60 italic mt-1">AI Generates. Humans Verify. You Trust.</p>
            </div>
          )}
          {collapsed && <span className="text-primary font-bold text-lg">A</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto p-2 border-t border-sidebar-border">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent/50 text-muted-foreground transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
