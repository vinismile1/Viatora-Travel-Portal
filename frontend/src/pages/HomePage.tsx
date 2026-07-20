import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { ModeSwitcher } from '../components/ModeSwitcher';
import { HotelCard } from '../components/HotelCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { AttractionCard } from '../components/AttractionCard';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Sparkles, Calendar, Plus } from 'lucide-react';
import { Destination } from '../types';

export function HomePage() {
  const { 
    destinations, hotels, restaurants, attractions, 
    activeMode, searchQuery, generateAIItinerary, createTrip, token, setActiveTab
  } = useApp();

  // Planning state
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [tripTitle, setTripTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [style, setStyle] = useState<'adventure' | 'luxury' | 'budget' | 'relaxation' | 'family'>('adventure');
  const [planningLoading, setPlanningLoading] = useState(false);

  const handleOpenPlanModal = (dest: Destination) => {
    setSelectedDest(dest);
    setTripTitle(`My Trip to ${dest.name}`);
    
    // Set default dates (tomorrow and 3 days later)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDays = new Date();
    threeDays.setDate(threeDays.getDate() + 4);
    
    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(threeDays.toISOString().split('T')[0]);
  };

  const handlePlanTrip = async (useAI: boolean) => {
    if (!token) {
      alert('Please log in first to plan customized trips!');
      return;
    }
    if (!selectedDest) return;

    setPlanningLoading(true);
    if (useAI) {
      // Calls Gemini to auto-generate full day-by-day itinerary
      const result = await generateAIItinerary(selectedDest.id, startDate, endDate, style);
      if (result) {
        alert(`Gemini AI successfully built a personalized itinerary for ${selectedDest.name}! See your Trips tab.`);
      }
    } else {
      // Creates a standard trip
      const result = await createTrip(selectedDest.id, tripTitle, startDate, endDate);
      if (result) {
        alert(`Your trip to ${selectedDest.name} was saved! See your Trips tab to customize.`);
      }
    }
    setPlanningLoading(false);
    setSelectedDest(null);
    setActiveTab('trips');
  };

  // ---------------- FILTERS LOGIC ----------------
  const query = searchQuery.toLowerCase().trim();

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(query) || d.country.toLowerCase().includes(query)
  );

  const filteredHotels = hotels.filter(h => {
    const dest = destinations.find(d => d.id === h.destinationId);
    const destMatches = dest ? dest.name.toLowerCase().includes(query) : false;
    return h.name.toLowerCase().includes(query) || destMatches;
  });

  const filteredRestaurants = restaurants.filter(r => {
    const dest = destinations.find(d => d.id === r.destinationId);
    const destMatches = dest ? dest.name.toLowerCase().includes(query) : false;
    return r.name.toLowerCase().includes(query) || r.cuisine.toLowerCase().includes(query) || destMatches;
  });

  const filteredAttractions = attractions.filter(a => {
    const dest = destinations.find(d => d.id === a.destinationId);
    const destMatches = dest ? dest.name.toLowerCase().includes(query) : false;
    return a.name.toLowerCase().includes(query) || a.category.toLowerCase().includes(query) || destMatches;
  });

  return (
    <div id="home_page_wrapper" className="pb-24 pt-4 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Intro Hero banner */}
      <div className="bg-gradient-to-r from-primary/10 via-theme-panel to-primary/5 border border-theme-border rounded-[2.5rem] p-8 md:p-12 mb-8 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-theme-text tracking-tight leading-tight relative z-10">
          Find Your Next <span className="text-primary bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">Adventure</span>
        </h1>
        <p className="text-theme-muted text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed relative z-10">
          Search destinations, reserve luxury hotels, secure gourmet dining, and map custom itineraries.
        </p>
      </div>

      {/* Central Search block */}
      <SearchBar />

      {/* Categories filters */}
      <ModeSwitcher />

      {/* Results Content lists based on Mode */}
      <div id="results_container" className="space-y-12">
        
        {/* EXPLORE / CITIES MODE */}
        {(activeMode === 'all' || activeMode === 'explore') && (
          <section id="destinations_section">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="font-display font-bold text-lg md:text-xl text-theme-text flex items-center gap-2">
                <MapPin className="text-primary" size={18} />
                <span>Popular Cities & Destinations</span>
              </h2>
              <span className="text-xs text-theme-muted font-mono">{filteredDestinations.length} available</span>
            </div>

            {filteredDestinations.length === 0 ? (
              <p className="text-theme-muted text-sm italic">No matching cities found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredDestinations.map(dest => (
                  <div
                    id={`dest_card_${dest.id}`}
                    key={dest.id}
                    onClick={() => handleOpenPlanModal(dest)}
                    className="group bg-theme-card rounded-[2rem] border border-theme-border shadow-2xl overflow-hidden hover:border-primary/30 cursor-pointer transition duration-300 relative text-theme-text"
                  >
                    <div className="h-44 overflow-hidden relative bg-theme-panel">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 bg-theme-card/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-theme-text flex items-center border border-theme-border">
                        <Star size={10} className="text-amber-500 fill-amber-500 mr-1" />
                        <span>{dest.rating}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display font-bold text-theme-text text-sm md:text-base group-hover:text-primary transition">{dest.name}</h4>
                      <p className="text-theme-muted text-xs mt-0.5">{dest.country}</p>
                      <p className="text-theme-muted text-xs mt-3 line-clamp-2 leading-relaxed">{dest.description}</p>
                      
                      <div className="flex items-center justify-end mt-4">
                        <span className="text-[10px] font-semibold text-primary group-hover:underline flex items-center gap-0.5">
                          <Plus size={12} /> Plan Trip
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TRAVEL / HOTELS MODE */}
        {(activeMode === 'all' || activeMode === 'travel') && (
          <section id="hotels_section">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="font-display font-bold text-lg md:text-xl text-theme-text flex items-center gap-2">
                <Sparkles className="text-primary animate-pulse" size={18} />
                <span>Curated Hotels & Resorts</span>
              </h2>
              <span className="text-xs text-theme-muted font-mono">{filteredHotels.length} luxury stays</span>
            </div>

            {filteredHotels.length === 0 ? (
              <p className="text-theme-muted text-sm italic">No matching hotels found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* FOOD / DINING MODE */}
        {(activeMode === 'all' || activeMode === 'food') && (
          <section id="restaurants_section">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="font-display font-bold text-lg md:text-xl text-theme-text flex items-center gap-2">
                <Sparkles className="text-rose-500" size={18} />
                <span>Culinary Hotspots & Dining</span>
              </h2>
              <span className="text-xs text-theme-muted font-mono">{filteredRestaurants.length} choices</span>
            </div>

            {filteredRestaurants.length === 0 ? (
              <p className="text-theme-muted text-sm italic">No matching dining options found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredRestaurants.map(rest => (
                  <RestaurantCard key={rest.id} restaurant={rest} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* GUIDE / ATTRACTIONS MODE */}
        {(activeMode === 'all' || activeMode === 'guide') && (
          <section id="attractions_section">
            <div className="flex items-center justify-between mb-6 px-1">
              <h2 className="font-display font-bold text-lg md:text-xl text-theme-text flex items-center gap-2">
                <Sparkles className="text-amber-500" size={18} />
                <span>Local Guides & Sights</span>
              </h2>
              <span className="text-xs text-theme-muted font-mono">{filteredAttractions.length} spots</span>
            </div>

            {filteredAttractions.length === 0 ? (
              <p className="text-theme-muted text-sm italic">No matching attractions found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredAttractions.map(attr => (
                  <AttractionCard key={attr.id} attraction={attr} />
                ))}
              </div>
            )}
          </section>
        )}

      </div>

      {/* PLAN TRIP MODAL (Triggers Gemini AI or Standard) */}
      {selectedDest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-card border border-theme-border rounded-[2.5rem] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 text-theme-text">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-primary animate-bounce-slow" size={20} />
              <h3 className="font-display font-bold text-lg text-theme-text">Plan Trip: {selectedDest.name}</h3>
            </div>
            <p className="text-xs text-theme-muted mb-5 leading-relaxed">
              Viatora can automatically coordinate with our local directory to generate a personalized day-by-day travel itinerary using Gemini.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-theme-muted mb-1">TRIP TITLE</label>
                <input
                  id="modal_trip_title"
                  type="text"
                  required
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">START DATE</label>
                  <div className="relative flex items-center">
                    <Calendar size={14} className="absolute left-3 text-theme-muted" />
                    <input
                      id="modal_start_date"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-theme-muted mb-1">END DATE</label>
                  <div className="relative flex items-center">
                    <Calendar size={14} className="absolute left-3 text-theme-muted" />
                    <input
                      id="modal_end_date"
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-9 pr-2 py-2 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-theme-muted mb-1">TRAVEL STYLE</label>
                <select
                  id="modal_travel_style"
                  value={style}
                  onChange={(e: any) => setStyle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-theme-panel border border-theme-border rounded-xl text-xs outline-none focus:border-primary text-theme-text"
                >
                  <option value="adventure">🎒 Adventure / Exploring</option>
                  <option value="luxury">💎 High-end Luxury</option>
                  <option value="budget">💵 Cost-conscious Budget</option>
                  <option value="relaxation">🏖️ Relaxation & Spa</option>
                  <option value="family">👨‍👩‍👧 Family Friendly</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  id="close_modal_btn"
                  onClick={() => setSelectedDest(null)}
                  disabled={planningLoading}
                  className="w-1/3 py-3 bg-theme-panel hover:bg-theme-panel/70 text-theme-text rounded-xl text-xs font-semibold transition border border-theme-border cursor-pointer"
                >
                  Cancel
                </button>
                
                {/* Standard basic creator */}
                <button
                  id="create_standard_trip_btn"
                  onClick={() => handlePlanTrip(false)}
                  disabled={planningLoading}
                  className="w-1/3 py-3 bg-theme-panel/50 border border-theme-border text-theme-text hover:bg-theme-panel rounded-xl text-xs font-semibold transition text-center cursor-pointer"
                >
                  Basic
                </button>

                {/* Gemini AI creator */}
                <button
                  id="create_ai_trip_btn"
                  onClick={() => handlePlanTrip(true)}
                  disabled={planningLoading}
                  className="w-1/3 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <Sparkles size={11} className="animate-pulse" />
                  <span>{planningLoading ? 'AI Thinking...' : 'Gemini AI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default HomePage;
