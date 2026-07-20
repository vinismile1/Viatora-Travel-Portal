import React from 'react';
import { Heart, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HotelCard } from '../components/HotelCard';
import { RestaurantCard } from '../components/RestaurantCard';
import { AttractionCard } from '../components/AttractionCard';

export function SavedPage() {
  const { savedPlaces, destinations, setActiveTab } = useApp();

  // Categorize saved items
  const savedHotels = savedPlaces.filter(s => s.type === 'hotel').map(s => s.place);
  const savedRestaurants = savedPlaces.filter(s => s.type === 'restaurant').map(s => s.place);
  const savedAttractions = savedPlaces.filter(s => s.type === 'attraction').map(s => s.place);

  const hasItems = savedPlaces.length > 0;

  return (
    <div id="saved_page_wrapper" className="pb-24 pt-4 px-4 md:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl text-theme-text tracking-tight">
          Saved Collections
        </h1>
        <p className="text-theme-muted text-xs md:text-sm mt-1">
          Review your pinned hotels, saved dining spots, and favorite sightseeing destinations.
        </p>
      </div>

      {!hasItems ? (
        <div className="bg-theme-card border border-theme-border rounded-[2.5rem] p-12 text-center text-theme-muted shadow-2xl">
          <div className="w-14 h-14 bg-theme-panel rounded-2xl flex items-center justify-center text-rose-400 mx-auto mb-4 border border-theme-border">
            <Heart size={24} className="fill-rose-500/10" />
          </div>
          <h3 className="font-display font-bold text-theme-text text-sm md:text-base mb-1">Your Library is Empty</h3>
          <p className="text-xs max-w-xs mx-auto leading-relaxed mb-4 text-theme-muted">
            Start bookmarks! Tap the heart icon on any resort, diner, or landmark in our primary feeds.
          </p>
          <button
            id="saved_discover_btn"
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover shadow-lg transition cursor-pointer"
          >
            Discover Places
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Saved Resorts */}
          {savedHotels.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-theme-muted mb-4 uppercase tracking-wider">Bookmarked Hotels ({savedHotels.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </div>
          )}

          {/* Saved Dining */}
          {savedRestaurants.length > 0 && (
            <div className="pt-6 border-t border-theme-border">
              <h2 className="text-xs font-bold text-theme-muted mb-4 uppercase tracking-wider">Saved Dining & Cafes ({savedRestaurants.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedRestaurants.map(rest => (
                  <RestaurantCard key={rest.id} restaurant={rest} />
                ))}
              </div>
            </div>
          )}

          {/* Saved Attractions */}
          {savedAttractions.length > 0 && (
            <div className="pt-6 border-t border-theme-border">
              <h2 className="text-xs font-bold text-theme-muted mb-4 uppercase tracking-wider">Local Landmarks & Sights ({savedAttractions.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {savedAttractions.map(attr => (
                  <AttractionCard key={attr.id} attraction={attr} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
export default SavedPage;
