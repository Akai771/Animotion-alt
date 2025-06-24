import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import SearchBox from "@/components/searchbox";
import Home from "../pages/home";
import Signup from "../pages/Authentication/signup";
import Login from "../pages/Authentication/login";
import ForgotPass from "@/pages/Authentication/Forgot-Password/forgot-password";
import ResetPass from "@/pages/Authentication/Forgot-Password/reset-password";
import AnimeDetails from "@/pages/Anime/animeDetails";
import History from "@/pages/history";
import Watchlist from "@/pages/watchlist";
import AnimePlayer from "@/pages/Anime/animePlayer";
import SearchPage from "@/pages/search-page";
import Chatbot from "@/pages/chatbot";
import News from "@/pages/news";
import Schedule from "@/pages/schedule";
import SplashPage from "@/pages/splash-page";
import Profile from "@/pages/profile";
import GenrePage from "@/pages/genre-page";
import Footer from "@/components/footer";

import { useIsMobile } from "@/hooks/use-mobile";

// Protected Route Wrapper
const ProtectedRoute = ({ token }: { token: any }) => {
  if (token === null) return null;
  return token ? <Outlet /> : <Navigate to="/login" />;
};

// Layout wrapper for protected routes
const ProtectedLayout = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Sidebar and SearchBox for protected routes */}
      <AppSidebar />
      {!isMobile && <SearchBox />}
      
      {/* Main content area with proper sidebar offset */}
      <SidebarInset className="flex flex-col min-h-screen">
        {isMobile && <SearchBox />}
        
        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>
        
        {/* Footer */}
        <Footer />
      </SidebarInset>
    </>
  );
};

// Routes where Sidebar should be hidden
const excludedRoutes = ["/", "/login", "/signup", "/forgot-password", "/update-password"];

export default function Routing() {
  const [token, setToken] = useState<any>(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        setToken(JSON.parse(storedToken));
      } catch (error) {
        console.error("Error parsing token from localStorage:", error);
        setToken(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;

    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      localStorage.removeItem("token");
    }
  }, [token, loading]);

  if (loading) return null;

  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <SidebarProvider>
      {isExcludedRoute ? (
        // Public routes without sidebar/footer
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/update-password" element={<ResetPass />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // Protected routes with sidebar and footer
        <Routes>
          <Route element={<ProtectedRoute token={token} />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/details/:id" element={<AnimeDetails />} />
              <Route path="/watch/:id" element={<AnimePlayer />} />
              <Route path="/history" element={<History />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/genre/:genreId" element={<GenrePage />} />
              <Route path="/search/:searchId" element={<SearchPage />} />
              <Route path="/hiro" element={<Chatbot />} />
              <Route path="/news" element={<News />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/profile" element={<Profile token={token} />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </SidebarProvider>
  );
}