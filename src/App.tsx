
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StaffAuthProvider } from "@/contexts/StaffAuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import StaffLogin from "./pages/StaffLogin";
import AllProjects from "./pages/AllProjects";
import AllNews from "./pages/AllNews";
import AllGallery from "./pages/AllGallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 0, // Always consider data stale to force fresh requests
      gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: 'always', // Always refetch when component mounts
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <StaffAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/staff-login" element={<StaffLogin />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<AllProjects />} />
              <Route path="/news" element={<AllNews />} />
              <Route path="/gallery" element={<AllGallery />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StaffAuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
