
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from "@/contexts/LanguageContext";
import { StaffAuthProvider } from "@/contexts/StaffAuthContext";
import { UserAuthProvider } from "@/components/UserAuthProvider";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import StaffLogin from "./pages/StaffLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <LanguageProvider>
        <StaffAuthProvider>
          <UserAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AnalyticsProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/staff-login" element={<StaffLogin />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnalyticsProvider>
              </BrowserRouter>
            </TooltipProvider>
          </UserAuthProvider>
        </StaffAuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
