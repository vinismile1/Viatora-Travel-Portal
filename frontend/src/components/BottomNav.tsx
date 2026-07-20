import React from 'react';
import { Home, Calendar, Map, Heart, User, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BottomNav() {
  const { activeTab, setActiveTab, bookings, trips, savedPlaces } = useApp();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, count: 0 },
    { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.filter(b => b.status === 'confirmed').length },
    { id: 'trips', label: 'My Trips', icon: Map, count: trips.length },
    { id: 'saved', label: 'Saved', icon: Heart, count: savedPlaces.length },
    { id: 'profile', label: 'Profile', icon: User, count: 0 },
  ] as const;

  return (
    <nav id="bottom_nav_bar" className="fixed bottom-0 left-0 right-0 z-40 bg-theme-bg/95 backdrop-blur-md border-t border-theme-border py-2.5 px-4 shadow-2xl transition-colors duration-300">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`nav_tab_${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-4.5 rounded-2xl transition-all duration-300 relative cursor-pointer ${
                isActive
                  ? 'text-primary scale-105'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
                {tab.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-theme-bg scale-90 shadow-sm transition-colors duration-300">
                    {tab.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium font-sans ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
export default BottomNav;
