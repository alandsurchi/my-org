import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StaffAuthProvider } from "@/contexts/StaffAuthContext";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StaffLogin from "./pages/StaffLogin";
import SecretEntryRedirect from "./pages/SecretEntryRedirect";
import AllProjects from "./pages/AllProjects";
import AllNewsAPI from "./pages/AllNewsAPI";
import AllGallery from "./pages/AllGallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry client errors (4xx)
        if (/HTTP 4\d\d/.test(error?.message ?? '')) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Staff pages (login + dashboard) keep their own fixed look; the public site
// follows the visitor's light/dark choice (remembered in localStorage).
const LIGHT_ONLY_PREFIXES = ['/dashboard', '/staff-login'];

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const forced = LIGHT_ONLY_PREFIXES.some((p) => pathname.startsWith(p)) ? 'light' : undefined;
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme={forced} storageKey="theme">
      {children}
    </ThemeProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <StaffAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppThemeProvider>
              <ScrollReveal />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/staff-login" element={<StaffLogin />} />
                {/* Secret entry route - redirects to staff-login for proper authentication */}
                <Route path={`/${import.meta.env.VITE_SECRET_STAFF_PATH || 'log-org'}`} element={<SecretEntryRedirect />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<AllProjects />} />
                <Route path="/news" element={<AllNewsAPI />} />
                <Route path="/gallery" element={<AllGallery />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </StaffAuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
