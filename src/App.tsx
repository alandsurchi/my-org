import { lazy, Suspense } from "react";
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

// Every other page is loaded on demand, so a visitor to the home page never
// downloads the dashboard or the list pages until they open them.
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StaffLogin = lazy(() => import("./pages/StaffLogin"));
const SecretEntryRedirect = lazy(() => import("./pages/SecretEntryRedirect"));
const AllProjects = lazy(() => import("./pages/AllProjects"));
const AllNewsAPI = lazy(() => import("./pages/AllNewsAPI"));
const AllGallery = lazy(() => import("./pages/AllGallery"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" aria-label="Loading" />
  </div>
);

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
              <Suspense fallback={<PageFallback />}>
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
              </Suspense>
            </AppThemeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </StaffAuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
