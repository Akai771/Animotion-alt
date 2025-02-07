import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
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
import Chatbot  from "@/pages/chatbot";
import News from "@/pages/news";
import Schedule from "@/pages/schedule";
import SplashPage from "@/pages/splash-page";
import Profile from "@/pages/profile";
import GenrePage from "@/pages/genre-page";

// Protected Route Wrapper
const ProtectedRoute = ({ token }: { token: any }) => {
  if (token === null) return null; // ✅ Prevent redirect before token is retrieved
  return token ? <Outlet /> : <Navigate to="/login" />;
};

// Routes where Sidebar should be hidden
const excludedRoutes = ["/", "/login", "/signup", "/forgot-password", "/update-password"];

export default function Routing() {
  const [token, setToken] = useState<any>(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true); // ✅ Prevent premature redirect

  // ✅ Retrieve token from localStorage on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        setToken(JSON.parse(storedToken)); // ✅ Parse token correctly
      } catch (error) {
        console.error("Error parsing token from localStorage:", error);
        setToken(null);
      }
    }
    setLoading(false); // ✅ Mark loading as false once retrieval is done
  }, []);

  // ✅ Store token in localStorage ONLY when it's NOT null on first load
  useEffect(() => {
    if (loading) return; // ✅ Prevent removing token on initial load

    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      localStorage.removeItem("token"); // ✅ Remove token only if user logs out
    }

  }, [token, loading]);

  // ✅ Show nothing until token is retrieved
  if (loading) return null;

  return (
    <>
      <SidebarProvider>
        {/* ✅ Show Sidebar only if NOT on an excluded route */}
        {!excludedRoutes.includes(location.pathname) && <AppSidebar />}
        {!excludedRoutes.includes(location.pathname) && <SearchBox />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/update-password" element={<ResetPass />} />

          {/* Protected Routes (Require Authentication) */}
          <Route element={<ProtectedRoute token={token} />}>
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

          {/* Catch-All Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </SidebarProvider>
    </>
  );
}
