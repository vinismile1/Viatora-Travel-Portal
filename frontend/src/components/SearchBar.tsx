import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div id="search_bar_container" className="relative w-full max-w-2xl mx-auto mb-6 px-4 md:px-0">
      <div className="relative flex items-center w-full bg-zinc-900/50 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
        <div className="pl-4 text-zinc-400">
          <Search size={20} />
        </div>
        <input
          id="search_input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Where are you traveling next? (e.g. Kyoto, Paris, Amalfi...)"
          className="w-full px-4 py-4 text-zinc-100 placeholder-zinc-500 bg-transparent outline-none font-sans text-sm md:text-base"
        />
        {searchQuery && (
          <button
            id="clear_search_btn"
            onClick={() => setSearchQuery('')}
            className="p-2 mr-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition"
          >
            <X size={16} />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 mr-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold select-none">
          <MapPin size={12} />
          <span>Live Directory</span>
        </div>
      </div>
    </div>
  );
}
