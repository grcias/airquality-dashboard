import { Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

// Custom PhCloudFill component
const PhCloudFill = ({ className }: { className?: string }) => (
  <svg 
    width="57" 
    height="57" 
    viewBox="0 0 57 57" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M35.6384 8.90625C31.9972 8.90682 28.4281 9.92081 25.3306 11.8347C22.2331 13.7486 19.7293 16.4868 18.0997 19.7429C16.7455 22.4424 16.0373 25.4198 16.0312 28.4399C16.0382 28.8988 15.8717 29.3434 15.565 29.6848C15.2582 30.0262 14.8339 30.2392 14.3769 30.2812C14.1325 30.2987 13.8872 30.2656 13.6562 30.1839C13.4252 30.1022 13.2136 29.9738 13.0345 29.8066C12.8554 29.6394 12.7127 29.4371 12.6154 29.2123C12.518 28.9875 12.4681 28.745 12.4688 28.5C12.467 26.0086 12.8685 23.5333 13.6577 21.1702C13.7097 21.0186 13.7199 20.8559 13.6872 20.6991C13.6545 20.5423 13.58 20.3972 13.4718 20.2791C13.3635 20.161 13.2254 20.0743 13.072 20.0282C12.9186 19.982 12.7556 19.9781 12.6001 20.0168C9.51371 20.7861 6.77279 22.5645 4.81267 25.0696C2.85255 27.5747 1.78559 30.6629 1.78125 33.8438C1.78125 41.679 8.40527 48.0938 16.2539 48.0938H35.625C38.2625 48.0909 40.8723 47.5562 43.2984 46.5215C45.7244 45.4868 47.9169 43.9734 49.7446 42.0719C51.5723 40.1704 52.9978 37.9198 53.9357 35.4547C54.8736 32.9896 55.3047 30.3607 55.2032 27.7252C54.7979 17.2648 46.1054 8.90625 35.6384 8.90625Z" 
      fill="#8DB2FF"
    />
  </svg>
);

const Header = ({ activeTab, onTabChange, searchQuery, onSearchChange, onSearch }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'graph', label: 'Graph' },
    { id: 'stations', label: 'Stations' }
  ];

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-lg">
              <PhCloudFill className="w-10 h-10" />
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#3D3D3D] tracking-tight">
              Air Quality
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={`px-4 xl:px-6 py-2 font-semibold transition-all duration-200 rounded-lg text-[#3D3D3D] ${
                  activeTab === tab.id 
                    ? 'bg-nav-active text-nav-active-foreground hover:bg-nav-active/90' 
                    : 'hover:bg-secondary'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                className="pl-10 w-48 lg:w-64 xl:w-80"
              />
            </div>
            
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Avatar */}
            <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start font-semibold transition-all duration-200 text-[#3D3D3D]"
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
            
            {/* Mobile Search Bar */}
            <div className="relative mt-4 sm:hidden">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                className="pl-10 w-full"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;