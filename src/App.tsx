
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StaffAuthProvider } from "@/contexts/StaffAuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StaffLogin from "./pages/StaffLogin";
import SecretEntryRedirect from "./pages/SecretEntryRedirect";
import AllProjects from "./pages/AllProjects";
import AllNewsAPI from "./pages/AllNewsAPI";
import AllGallery from "./pages/AllGallery";
import AllStaff from "./pages/AllStaff";
import NotFound from "./pages/NotFound";

// Enhanced QueryClient configuration for better error handling and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry 4xx errors
        if (error?.message?.includes('4')) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus to avoid flicker
      refetchOnMount: false, // Use cached data on mount if available
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
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
              <Route path="/staff-login" element={<StaffLogin />} />
              {/* Secret entry route - redirects to staff-login for proper authentication */}
              <Route path={`/${import.meta.env.VITE_SECRET_STAFF_PATH || 'log-org'}`} element={<SecretEntryRedirect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<AllProjects />} />
              <Route path="/news" element={<AllNewsAPI />} />
              <Route path="/gallery" element={<AllGallery />} />
              <Route path="/staff" element={<AllStaff />} />
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
