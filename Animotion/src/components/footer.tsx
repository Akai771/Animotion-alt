import React from "react";
import { Link } from "react-router-dom";
import { Github, Mail, Heart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();

  return (
    <footer className="bg-[--bgColor2] text-[--text-color2] mt-14">
        <div className="border-t border-[--bgColor3] w-[95dvw]"/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-2 lg:grid-cols-4 gap-8'}`}>
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                className="w-16 h-14"
                src="Animotion_Light.svg"
                alt="Animotion Logo"
              />
            </div>
            <p className="text-sm text-[--text-color2] leading-relaxed">
              Your gateway to endless anime entertainment. Free, ad-free, and built for fans.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/akai771" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[--text-color2] hover:text-[--text-color] transition-colors duration-200"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:akai91408@gmail.com"
                className="text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[--text-color]">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/home" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Home
              </Link>
              <Link to="/schedule" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Schedule
              </Link>
              <Link to="/news" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                News
              </Link>
              <Link to="/watchlist" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Watchlist
              </Link>
              <Link to="/history" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                History
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[--text-color]">Categories</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/genre/action" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Action
              </Link>
              <Link to="/genre/romance" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Romance
              </Link>
              <Link to="/genre/comedy" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Comedy
              </Link>
              <Link to="/genre/drama" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Drama
              </Link>
              <Link to="/genre/fantasy" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Fantasy
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[--text-color]">Support</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/profile" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                Profile
              </Link>
              <Link to="/hiro" className="text-sm text-[--text-color2] hover:text-[--secondary-color] transition-colors duration-200">
                AI Chatbot
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[--bgColor3] mt-8 pt-6">
          
          {/* Bottom Section */}
          <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row justify-between items-center'}`}>
            
            {/* Copyright */}
            <div className={`flex items-center space-x-2 text-sm text-[--text-color2] ${isMobile ? 'justify-center' : ''}`}>
              <span>© {currentYear} Animotion. Made with</span>
              <Heart size={14} className="text-red-500 fill-current" />
              <span>for anime fans worldwide.</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className={`mt-2 text-xs text-[--text-color3] ${isMobile ? 'text-center' : 'text-center md:text-left'}`}>
            <span className="text-xs text-[--text-color3]">
              This site does not store any files on our server. All contents are provided by non-affiliated third parties.
              Animotion is not responsible for the accuracy, compliance, copyright, legality, decency, or any other aspect of the content.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;