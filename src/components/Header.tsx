import { Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'forecast', label: 'Forecast' },
    { id: 'graph', label: 'Graph' },
    { id: 'stations', label: 'Stations' }
  ];

  return (
    <header className="bg-card border-b border-border shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-xl">
              <Cloud className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Air Quality
            </h1>
          </div>
          
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className="px-6 py-2 font-medium transition-all duration-200"
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;