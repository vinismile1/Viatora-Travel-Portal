import React from 'react';
import { Compass, Hotel, Utensils, Map, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ModeSwitcher() {
  const { activeMode, setActiveMode } = useApp();

  const modes = [
    { id: 'all', label: 'All Companion', icon: Compass, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'travel', label: 'Travel & Hotels', icon: Hotel, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { id: 'explore', label: 'Explore Cities', icon: Map, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'guide', label: 'Local Guides', icon: Landmark, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  ] as const;

  return (
    <div id="mode_switcher_container" className="w-full flex justify-start md:justify-center overflow-x-auto no-scrollbar py-2 px-4 mb-8">
      <div className="flex gap-3 min-w-max">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              id={`mode_btn_${mode.id}`}
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs md:text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-lg transform scale-105'
                  : 'bg-zinc-900/40 text-zinc-400 border-white/5 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-zinc-500'} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default ModeSwitcher;
