import React, { useState } from 'react';
import { Compass, Sparkles, Map, Calendar, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TripCard } from '../components/TripCard';

export function TripsPage() {
  const { trips, destinations, createTrip, generateAIItinerary, token } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Trip details form states
  const [destId, setDestId] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [style, setStyle] = useState<'adventure' | 'luxury' | 'budget' | 'relaxation' | 'family'>('adventure');
  const [loading, setLoading] = useState(false);

  const handleCreateTrip = async (useAI: boolean) => {
    if (!token) {
      alert('Please log in or register to schedule itineraries.');
      return;
    }
    if (!destId || !title || !startDate || !endDate) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);
    const dest = destinations.find(d => d.id === destId);
    
    if (useAI) {
      const result = await generateAIItinerary(destId, startDate, endDate, style);
      if (result) {
        alert(`Gemini AI created a fully custom ${style} itinerary for your trip to ${dest?.name}!`);
        setShowAddForm(false);
        resetForm();
      }
    } else {
      const result = await createTrip(destId, title, startDate, endDate);
      if (result) {
        alert(`Your trip to ${dest?.name} has been scheduled! Expand the trip to start organizing.`);
        setShowAddForm(false);
        resetForm();
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setDestId('');
    setTitle('');
    setStartDate('');
    setEndDate('');
    setStyle('adventure');
  };

  return (
    <div id="trips_page_wrapper" className="pb-24 pt-4 px-4 md:px-8 max-w-4xl mx-auto">
      
      {/* Header with quick creation action */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white tracking-tight">
            My Planned Trips
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1">
            Browse and organize day-by-day travel schedules, or trigger Gemini to draft high-fidelity custom timetrees.
          </p>
        </div>
        
        {!showAddForm && (
          <button
            id="plan_new_trip_btn"
            onClick={() => {
              setShowAddForm(true);
              if (destinations.length > 0) {
                setDestId(destinations[0].id);
                setTitle(`My Trip to ${destinations[0].name}`);
              }
            }}
            className="flex items-center gap-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl shadow-lg transition duration-300 cursor-pointer animate-in fade-in zoom-in-95"
          >
            <Plus size={14} />
            <span>Plan a Trip</span>
          </button>
        )}
      </div>

      {/* Slide-out quick planner form inside page */}
      {showAddForm && (
        <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-6 mb-8 shadow-2xl relative animate-in fade-in slide-in-from-top-3 duration-250 text-zinc-200">
          <button
            id="close_trip_form_btn"
            onClick={() => setShowAddForm(false)}
            className="absolute top-4 right-4 p-1.5 hover:bg-zinc-900 rounded-full text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
          >
            <X size={16} />
          </button>

          <h3 className="font-display font-bold text-white text-base mb-1">Create Travel Itinerary</h3>
          <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
            Choose standard scheduling or let our Gemini module structure customizable activities automatically.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">CITY / DESTINATION</label>
                <select
                  id="select_dest_trip_form"
                  value={destId}
                  onChange={(e) => {
                    setDestId(e.target.value);
                    const dest = destinations.find(d => d.id === e.target.value);
                    if (dest) setTitle(`My Trip to ${dest.name}`);
                  }}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs outline-none focus:border-primary text-zinc-300 font-sans"
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id} className="bg-zinc-950 text-zinc-200">{d.name} ({d.country})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">TRIP TITLE</label>
                <input
                  id="input_title_trip_form"
                  type="text"
                  required
                  placeholder="Summer Vacation..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs outline-none focus:border-primary text-zinc-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">START DATE</label>
                <input
                  id="input_start_date_trip_form"
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs outline-none text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">END DATE</label>
                <input
                  id="input_end_date_trip_form"
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-2 bg-zinc-900 border border-white/10 rounded-xl text-xs outline-none text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 mb-1">TRAVEL STYLE</label>
                <select
                  id="select_style_trip_form"
                  value={style}
                  onChange={(e: any) => setStyle(e.target.value)}
                  className="w-full px-2 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs outline-none focus:border-primary text-zinc-300"
                >
                  <option value="adventure" className="bg-zinc-950">🎒 Adventure</option>
                  <option value="luxury" className="bg-zinc-950">💎 Luxury</option>
                  <option value="budget" className="bg-zinc-950">💵 Budget</option>
                  <option value="relaxation" className="bg-zinc-950">🏖️ Relaxation</option>
                  <option value="family" className="bg-zinc-950">👨‍👩‍👧 Family</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                id="form_standard_btn"
                onClick={() => handleCreateTrip(false)}
                disabled={loading}
                className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold rounded-xl border border-white/5 transition cursor-pointer"
              >
                Create Standard
              </button>
              
              <button
                id="form_ai_btn"
                onClick={() => handleCreateTrip(true)}
                disabled={loading}
                className="flex items-center gap-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
              >
                <Sparkles size={12} className="animate-pulse" />
                <span>{loading ? 'AI Organizing...' : 'Build Itinerary with Gemini'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main trips lists */}
      {trips.length === 0 ? (
        <div className="bg-zinc-900/40 border border-white/10 rounded-[2.5rem] p-12 text-center text-zinc-500 shadow-2xl">
          <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-zinc-400 mx-auto mb-4 border border-white/10">
            <Map size={24} />
          </div>
          <h3 className="font-display font-bold text-zinc-300 text-sm md:text-base mb-1">No Planned Trips</h3>
          <p className="text-xs max-w-xs mx-auto leading-relaxed text-zinc-400">
            Plan your next journey! Choose standard planning or trigger our Gemini builder to structure activities automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

    </div>
  );
}
export default TripsPage;
