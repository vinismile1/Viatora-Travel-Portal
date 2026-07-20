import React, { useState } from 'react';
import { Star, Heart, Calendar, Clock } from 'lucide-react';
import { Restaurant } from '../types';
import { useApp } from '../context/AppContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  key?: any;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { toggleSave, savedPlaces, createBooking, token } = useApp();
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('19:00');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const isSaved = savedPlaces.some(s => s.placeId === restaurant.id);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave(restaurant.id, 'restaurant');
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in first to secure reservation tables!');
      return;
    }
    if (!bookingDate) return;

    const success = await createBooking({
      type: 'attraction', // Standard attraction/activity slot
      title: `${restaurant.name} Table Reservation`,
      details: `Table for 2 - ${restaurant.cuisine}. Specialty: ${restaurant.specialties[0]}`,
      price: 15, // Reservation deposit
      date: `${bookingDate} at ${bookingTime}`,
      image: restaurant.image
    });

    if (success) {
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setBookingDate('');
      }, 2000);
    }
  };

  return (
    <div id={`restaurant_card_${restaurant.id}`} className="flex flex-col bg-zinc-900/40 rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl hover:border-white/20 transition duration-300 relative text-zinc-200">
      {/* Save Button */}
      <button
        id={`save_restaurant_btn_${restaurant.id}`}
        onClick={handleSave}
        className="absolute top-4 right-4 z-10 p-2 bg-zinc-950/80 backdrop-blur-md rounded-full border border-white/10 shadow hover:bg-zinc-900 text-zinc-400 hover:text-rose-400 transition-colors"
      >
        <Heart size={18} className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
      </button>

      {/* Restaurant Image */}
      <div className="h-48 overflow-hidden relative bg-zinc-950">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-zinc-950/85 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-bold text-zinc-300 border border-white/10">
          {restaurant.priceLevel}
        </div>
        <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-zinc-100 flex items-center border border-white/10">
          <Star size={12} className="text-amber-500 fill-amber-500 mr-1" />
          <span>{restaurant.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-display font-semibold text-white text-base md:text-lg">{restaurant.name}</h3>
          </div>
          <p className="text-emerald-400 text-xs font-medium mb-2.5">{restaurant.cuisine}</p>
          <p className="text-zinc-400 text-xs md:text-sm mb-4 line-clamp-2">{restaurant.description}</p>
          
          {/* Specialties tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {restaurant.specialties.map((spec, idx) => (
              <span key={idx} className="bg-white/5 text-zinc-300 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-medium">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs text-zinc-500 font-sans">Highly Rated Dining</span>
            <button
              id={`book_restaurant_modal_btn_${restaurant.id}`}
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 shadow-md transition"
            >
              Book Table
            </button>
          </div>
        </div>
      </div>

      {/* Simple Booking Modal Overlay */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-display font-semibold text-lg text-white mb-1">Reserve Table: {restaurant.name}</h3>
            <p className="text-xs text-zinc-400 mb-4">Secures a table reservation for 2. Small reservation deposit applies.</p>
            
            {bookingSuccess ? (
              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl p-4 text-center my-6">
                <p className="font-semibold mb-1">Reservation Scheduled!</p>
                <p className="text-xs">Check your itinerary and inbox for reservation notifications.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Date</label>
                    <div className="relative flex items-center">
                      <Calendar size={16} className="absolute left-3 text-zinc-500" />
                      <input
                        id="restaurant_booking_date_input"
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-xl outline-none focus:border-emerald-500 text-sm text-zinc-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1">Time</label>
                    <div className="relative flex items-center">
                      <Clock size={16} className="absolute left-3 text-zinc-500" />
                      <input
                        id="restaurant_booking_time_input"
                        type="text"
                        required
                        placeholder="19:00"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-xl outline-none focus:border-emerald-500 text-sm text-zinc-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    id="cancel_restaurant_booking_btn"
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="w-1/2 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs font-semibold transition border border-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm_restaurant_booking_btn"
                    type="submit"
                    className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
                  >
                    Confirm Table
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default RestaurantCard;
