import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Calendar, Home, Newspaper, Bookmark, BotMessageSquare, Shuffle, History, LogOut, Moon, Sun, Menu } from "lucide-react";
import { supabase } from "../hooks/supabaseClient";
import Avatar from '@mui/material/Avatar';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Define menu items
const mainNavItems = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Anime Schedule", url: "/schedule", icon: Calendar },
  { title: "Anime News", url: "/news", icon: Newspaper },
];

const animeNavItems = [
  { title: "Watchlist", url: "/watchlist", icon: Bookmark },
  { title: "History", url: "/history", icon: History },
];

const userNavItems = [
  { title: "Hiro - AI Chatbot", url: "/hiro", icon: BotMessageSquare },
];

type Anime = {
  id: string;
  name: string;
  poster: string;
};

export function AppSidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pfp, setPfp] = useState<string>("https://via.placeholder.com/150");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(!isDark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    supabase.auth.signOut();
    navigate("/login");
  };
  
  const [randomAnime, setRandomAnime] = useState<Anime[]>([]);
  
  const randomPage: number = Math.floor(Math.random() * 95);
  const randomIndex: number = randomAnime.length > 0 ? Math.floor(Math.random() * randomAnime.length) : 0;
  
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/azlist/all?page=${randomPage}`)
      .then((res) => setRandomAnime(res.data.data.animes))
      .catch((err) => console.error("Error fetching random anime:", err));

    const storedPfp = localStorage.getItem("pfp");
    if (storedPfp) {
      setPfp(storedPfp);
    }
    
    // Check for dark mode on first load
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);
  
  const randomAnimeData = randomAnime[randomIndex];
  
  const handleRandomAnime = () => {
    if (randomAnimeData) {
      navigate(`/details/${randomAnimeData.id}`);
      window.location.reload();
    }
  };

  // For mobile devices, render a Sheet component instead of sidebar
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 z-50 p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-[--bgColor3]">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-full overflow-y-auto flex flex-col">
              {/* Logo section */}
              <div className="p-4 border-b border-[--bgColor3]">
                <img 
                  src={isDarkMode ? "Animotion_Dark.svg" : "Animotion_Light.svg"} 
                  alt="Animotion Logo" 
                  className="h-10 mb-2"
                />
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {/* Main Navigation */}
                <div className="py-2">
                  {mainNavItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <Link 
                        key={item.title} 
                        to={item.url} 
                        className={`flex items-center gap-2 px-4 py-3 ${isActive ? "bg-[--primary-color] text-white" : "hover:bg-[--bgColor3] text-[--text-color]"}`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
                
                <div className="border-t border-[--bgColor3] my-2"></div>
                
                {/* Anime Section */}
                <div className="py-2">
                  {animeNavItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <Link 
                        key={item.title} 
                        to={item.url} 
                        className={`flex items-center gap-2 px-4 py-3 ${isActive ? "bg-[--primary-color] text-white" : "hover:bg-[--bgColor3] text-[--text-color]"}`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                      </Link>
                    );
                  })}

                  {/* Random Anime */}
                  <button 
                    onClick={handleRandomAnime}
                    className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-[--bgColor3] text-[--text-color]"
                  >
                    <Shuffle className="w-5 h-5" />
                    Random Anime
                  </button>
                </div>
                
                <div className="border-t border-[--bgColor3] my-2"></div>
                
                {/* User Section */}
                <div className="py-2">
                  {userNavItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <Link 
                        key={item.title} 
                        to={item.url} 
                        className={`flex items-center gap-2 px-4 py-3 ${isActive ? "bg-[--primary-color] text-white" : "hover:bg-[--bgColor3] text-[--text-color]"}`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.title}
                      </Link>
                    );
                  })}

                  {/* Profile */}
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-3 hover:bg-[--bgColor3] text-[--text-color]"
                  >
                    <Avatar src={pfp} alt="profile" sx={{ width: 24, height: 24 }}/>
                    Profile
                  </Link>
                </div>
              </div>
              
              {/* Footer section with theme and logout */}
              <div className="mt-auto border-t border-[--bgColor3]">
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-[--bgColor3] text-[--text-color]"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
                
                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 w-full text-left hover:bg-[--bgColor3] text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // For desktop, render the original sidebar
  return (
    <div className="flex relative z-20">
      <Sidebar className="fixed h-full w-64">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <img src={isDarkMode ? "Animotion_Dark.svg" : "Animotion_Light.svg"} alt="Animotion Logo" />
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {/* Main Navigation */}
                {mainNavItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <TooltipProvider key={item.title}>
                      <Tooltip delayDuration={50} >
                        <SidebarMenuItem>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <a href={item.url} className={`text-[--text-color] flex items-center gap-2 ${isActive ? "text-[--secondary-color]" : "hover:text-gray-400"}`}>
                                <item.icon className={`w-5 h-5 ${isActive ? "text-[--secondary-color]" : "text-[--text-color]"}`} />
                                {item.title}
                              </a>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">
                            {item.title}
                          </TooltipContent>
                        </SidebarMenuItem>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}

                {/* Anime Section */}
                <SidebarSeparator />
                {animeNavItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <TooltipProvider key={item.title}>
                      <Tooltip delayDuration={50}>
                        <SidebarMenuItem>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <a href={item.url} className={`text-[--text-color] flex items-center gap-2 ${isActive ? "text-[--secondary-color]" : "hover:text-gray-400"}`}>
                                <item.icon className={`w-5 h-5 ${isActive ? "text-[--secondary-color]" : "text-[--text-color]"}`} />
                                {item.title}
                              </a>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">
                            {item.title}
                          </TooltipContent>
                        </SidebarMenuItem>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <SidebarMenuItem>
                      <TooltipTrigger>
                        <SidebarMenuButton asChild onClick={handleRandomAnime}>
                          <span>
                            <Shuffle className={`w-5 h-5`} />
                            Random Anime
                          </span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">Random Anime</TooltipContent>
                    </SidebarMenuItem>
                    </Tooltip>
                </TooltipProvider>

                {/* User Section */}
                <SidebarSeparator />
                {userNavItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <TooltipProvider key={item.title}>
                      <Tooltip delayDuration={50}>
                        <SidebarMenuItem>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <a href={item.url} className={`text-[--text-color] flex items-center gap-2 ${isActive ? "text-[--secondary-color]" : "hover:text-gray-400"}`}>
                                <item.icon className={`w-5 h-5 ${isActive ? "text-[--secondary-color]" : "text-[--text-color]"}`} />
                                {item.title}
                              </a>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">
                            {item.title}
                          </TooltipContent>
                        </SidebarMenuItem>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <SidebarMenuItem className="flex flex-col items-center">
                      <TooltipTrigger>
                        <Link to="/profile">
                          <Avatar src={pfp} alt="profile" sx={{ width: 25, height: 25 }}/>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">Profile</TooltipContent>
                    </SidebarMenuItem>
                    </Tooltip>
                </TooltipProvider>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer Section */}
        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarSeparator />

                {/* Toggle Theme */}
                <SidebarMenuItem>
                  <TooltipProvider>
                    <Tooltip delayDuration={50}>
                      <TooltipTrigger>
                        <SidebarMenuButton onClick={toggleTheme}>
                          {isDarkMode ? <Sun /> : <Moon />}
                          {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">
                        Toggle Theme
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>

                {/* Logout */}
                <SidebarMenuItem>
                  <TooltipProvider>
                    <Tooltip delayDuration={50}>
                      <TooltipTrigger>
                        <SidebarMenuButton onClick={handleLogout} className="transition-all duration-200 ease-in-out hover:text-red-500">
                          <LogOut />
                          <span>Logout</span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-[--bgColor3] text-[--text-color] ml-4 p-2 rounded-lg">
                        Logout
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}