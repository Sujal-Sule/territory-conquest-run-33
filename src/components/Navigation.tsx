import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Activity, 
  Trophy, 
  User, 
  Settings,
  Bell,
  Zap 
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'map', label: 'Territory Map', icon: Map },
    { id: 'dashboard', label: 'Run Dashboard', icon: Activity },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="card-game p-3 sm:p-4 mb-4 sm:mb-6">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        {/* Top row: Logo and User */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TerritoryRun
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative w-8 h-8">
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs bg-destructive">
                3
              </Badge>
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
              A
            </div>
          </div>
        </div>
        
        {/* Bottom row: Navigation */}
        <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                size="sm"
                className={`flex flex-col items-center gap-1 px-3 py-2 min-w-fit ${
                  activeTab === item.id 
                    ? 'btn-conquest text-xs' 
                    : 'hover:bg-muted transition-colors text-xs'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs leading-none">{item.label.split(' ')[0]}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TerritoryRun
            </h1>
            <p className="text-xs text-muted-foreground">Conquer Your City</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'btn-conquest' 
                    : 'hover:bg-muted transition-colors'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 px-1 py-0 text-xs bg-destructive">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
              A
            </div>
            <div className="hidden xl:block">
              <div className="text-sm font-semibold">Alex Runner</div>
              <div className="text-xs text-muted-foreground">Level 12</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;