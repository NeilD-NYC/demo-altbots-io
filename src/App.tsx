import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AlertBanner from "@/components/AlertBanner";
import Index from "./pages/Index";
import ManagerGrid from "./pages/ManagerGrid";
import ManagerDetail from "./pages/ManagerDetail";
import AIAnalyst from "./pages/AIAnalyst";
import ConnectionGraph from "./pages/ConnectionGraph";
import Performance from "./pages/Performance";
import Liquidity from "./pages/Liquidity";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AlertBanner />
              <DashboardHeader />
              <DataSourcesStrip />
              <div className="flex items-center h-10 px-4 border-b border-border bg-card/50">
                <SidebarTrigger />
              </div>
              <main className="flex-1 overflow-auto scrollbar-thin">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/liquidity" element={<Liquidity />} />
                  <Route path="/managers" element={<ManagerGrid />} />
                  <Route path="/manager/:id" element={<ManagerDetail />} />
                  <Route path="/analyst" element={<AIAnalyst />} />
                  <Route path="/connections" element={<ConnectionGraph />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
